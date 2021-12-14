const token = require("../middleware/token") // verify token
const MyDatabase = require("../models") // access tables in database
const fs = require("fs") // file management

//---------------------------------------- CREATE one post -------------->

exports.createPost = async (req, res) => {
  const userId = token.getUserId(req)
  let imageUrl
  try {
    // try to find this user buy his Id
    const user = await MyDatabase.User.findOne({
      attributes: ["username", "id", "avatar"],
      where: { id: userId },
    })
    // if ok get the file in the request
    if (user !== null) {
      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/upload/${
          req.file.filename
        }`
      } else {
        imageUrl = null
      }
      // create this post in database
      const post = await MyDatabase.Post.create({
        include: [
          {
            model: MyDatabase.User,
            attributes: ["username", "avatar", "id"],
          },
        ],
        message: req.body.message,
        link: req.body.link,
        imageUrl: imageUrl,
        UserId: user.id,
      })

      res
        .status(201)
        .json({ post: post, messageRetour: "Votre post est ajouté" })
    } else {
      res.status(400).send({ error: "Erreur " })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- GET one post -------------->

exports.getOnePost = async (req, res) => {
  try {
    // try to find this user buy his Id
    const post = await MyDatabase.Post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: MyDatabase.User,
          attributes: ["username", "avatar", "id"],
        },
        {
          model: MyDatabase.Like,
          attributes: ["PostId", "UserId"],
        },
        {
          model: MyDatabase.Comment,
          order: [["createdAt", "DESC"]],
          attributes: ["message", "username", "UserId"],
          include: [
            {
              model: MyDatabase.User,
              attributes: ["avatar", "username"],
            },
          ],
        },
      ],
    })
    // Added every data needed for front

    res.status(200).json(post)
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- GET all posts -------------->

exports.getAllPosts = async (req, res) => {
  try {
    // get all posts from database
    const posts = await MyDatabase.Post.findAll({
      attributes: ["id", "message", "imageUrl", "link", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: MyDatabase.User,
          attributes: ["username", "id", "avatar"],
        },
        {
          model: MyDatabase.Like,
          attributes: ["UserId"],
        },
        {
          model: MyDatabase.Comment,
          attributes: ["message", "username", "UserId", "id"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: MyDatabase.User,
              attributes: ["avatar", "username"],
            },
          ],
        },
      ],
    }) // Added every data needed for front + order we want
    res.status(200).send(posts)
  } catch (error) {
    return res.status(500).send({
      error: "erreur server ",
    })
  }
}

//---------------------------------------- UPDATE one post -------------->

exports.updatePost = async (req, res) => {
  try {
    // try to find this post buy his Id
    let newImageUrl
    const userId = token.getUserId(req)
    let post = await MyDatabase.Post.findOne({ where: { id: req.params.id } })
    // Make sure this user is the owner
    if (userId === post.UserId) {
      // if a file is in the request
      if (req.file) {
        newImageUrl = `${req.protocol}://${req.get("host")}/upload/${
          req.file.filename
        }`
        // if an image was already in database
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/upload")[1]
          // delete it from the "upload" file
          fs.unlink(`upload/${filename}`, (err) => {
            if (err) console.log(err)
            else {
              console.log(`Deleted file: upload/${filename}`)
            }
          })
        }
      } // if a new message is in the request
      if (req.body.message) {
        post.message = req.body.message
      } // we replace the old on && link (GIF) too
      post.link = req.body.link
      post.imageUrl = newImageUrl
      // then we save everything in database
      const newPost = await post.save({
        fields: ["message", "link", "imageUrl"],
      })
      res.status(200).json({ newPost: newPost, messageRetour: "post modifié" })
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- DELETE one post -------------->

exports.deletePost = async (req, res) => {
  try {
    const userId = token.getUserId(req)
    const checkIfAdmin = await MyDatabase.User.findOne({
      where: { id: userId },
    })
    const post = await MyDatabase.Post.findOne({ where: { id: req.params.id } })
    if (userId === post.UserId || checkIfAdmin.isAdmin === true) {
      if (post.imageUrl) {
        const filename = post.imageUrl.split("/upload")[1]
        fs.unlink(`upload/${filename}`, () => {
          MyDatabase.Post.destroy({ where: { id: post.id } })
          res.status(200).json({ message: "Post supprimé" })
        })
      } else {
        MyDatabase.Post.destroy({ where: { id: post.id } }, { truncate: true })
        res.status(200).json({ message: "Post supprimé" })
      }
    } else {
      res.status(401).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- LIKE one post -------------->

exports.likePost = async (req, res, next) => {
  try {
    const userId = token.getUserId(req)
    const postId = req.params.id
    const user = await MyDatabase.Like.findOne({
      where: { UserId: userId, PostId: postId },
    })
    if (user) {
      await MyDatabase.Like.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      )
      res.status(200).send({ messageRetour: "vou n'aimez plus ce post" })
    } else {
      await MyDatabase.Like.create({
        UserId: userId,
        PostId: postId,
      })
      res.status(201).json({ messageRetour: "vous aimez ce post" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- ADD one comment -------------->

exports.addComment = async (req, res) => {
  try {
    const comment = req.body.commentMessage
    const username = req.body.commentusername
    const newComment = await MyDatabase.Comment.create({
      message: comment,
      username: username,
      UserId: token.getUserId(req),
      PostId: req.params.id,
    })

    res
      .status(201)
      .json({ newComment, messageRetour: "votre commentaire est publié" })
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//---------------------------------------- DELETE one comment -------------->

exports.deleteComment = async (req, res) => {
  try {
    const userId = token.getUserId(req)
    const checkIfAdmin = await MyDatabase.User.findOne({
      where: { id: userId },
    })
    const comment = await MyDatabase.Comment.findOne({
      where: { id: req.params.id },
    })

    if (userId === comment.UserId || checkIfAdmin.isAdmin === true) {
      MyDatabase.Comment.destroy(
        { where: { id: req.params.id } },
        { truncate: true }
      )
      res.status(200).json({ message: "commentaire supprimé" })
    } else {
      res.status(401).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
