const token = require("../middleware/token")
const MyDatabase = require("../models")
const fs = require("fs") //

//------------------------------------------ CREATE POST -----------------

exports.createPost = async (req, res) => {
  const userId = token.getUserId(req)
  let imageUrl
  try {
    // try to find one user by his Id
    const user = await MyDatabase.User.findOne({
      attributes: ["username", "id", "avatar"],
      where: { id: userId },
    })

    if (user !== null) {
      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`
      } else {
        imageUrl = null
      } // then save this post in database
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
      res.status(400).send({ error: "Erreur dans votre saisie " })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ UPDATE POST -----------------

exports.updatePost = async (req, res) => {
  try {
    let newImageUrl
    // try to find one user by his Id
    const userId = token.getUserId(req)
    let post = await MyDatabase.Post.findOne({ where: { id: req.params.id } })
    // if one add this new image to "upload"
    if (userId === post.UserId) {
      if (req.file) {
        newImageUrl = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`
        // if already on image delete it
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/upload")[1]
          fs.unlink(`upload/${filename}`, (err) => {
            if (err) console.log(err)
            else {
              console.log(`Deleted file: upload/${filename}`)
            }
          })
        }
      }
      // if in the request there is a message add it
      if (req.body.message) {
        post.message = req.body.message
      }
      // then save everything in th database
      post.link = req.body.link
      post.imageUrl = newImageUrl
      const newPost = await post.save({
        fields: ["message", "link", "imageUrl"],
      })
      res.status(200).json({ newPost: newPost, messageRetour: "post modifié" })
    } else {
      res.status(400).json({ message: " Il y a une erreur dans la saisie" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ DELETE POST -----------------

exports.deletePost = async (req, res) => {
  try {
    // try to find one user by his Id or if admin
    const userId = token.getUserId(req)
    const checkIfAdmin = await MyDatabase.User.findOne({
      where: { id: userId },
    })
    const post = await MyDatabase.Post.findOne({ where: { id: req.params.id } })
    // if it is the owner of this post or the admin
    if (userId === post.UserId || checkIfAdmin.isAdmin === true) {
      if (post.imageUrl) {
        // then if an image exist delete it
        const filename = post.imageUrl.split("/upload")[1]
        fs.unlink(`upload/${filename}`, () => {
          MyDatabase.Post.destroy({ where: { id: post.id } })
          res.status(200).json({ message: "Post supprimé" })
        })
        // else just delete this post
      } else {
        MyDatabase.Post.destroy({ where: { id: post.id } }, { truncate: true })
        res.status(200).json({ message: "Post supprimé" })
      }
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//------------------------------------------ GET ONE POST -----------------

exports.getOnePost = async (req, res) => {
  try {
    // try to find one user by his Id
    const post = await MyDatabase.Post.findOne({
      where: { id: req.params.id },
      // i want also user info & likes & comment
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
    res.status(200).json(post)
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ GET ALL POSTS -----------------

exports.getAllPosts = async (req, res) => {
  try {
    // try to find all posts
    const posts = await MyDatabase.Post.findAll({
      attributes: ["id", "message", "imageUrl", "link", "createdAt"],
      order: [["createdAt", "DESC"]],
      // i also want user info & likes & comment
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
    })
    res.status(200).send(posts)
  } catch (error) {
    return res.status(500).send({
      error: "erreur server aucun posts recupérés ",
    })
  }
}
//------------------------------------------ LIKE POST -----------------

exports.likePost = async (req, res, next) => {
  try {
    const userId = token.getUserId(req)
    const postId = req.params.id
    // try to find like with this userId & this postId
    const user = await MyDatabase.Like.findOne({
      where: { UserId: userId, PostId: postId },
    })
    if (user) {
      // if there is one delete it from database
      await MyDatabase.Like.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      )
      res.status(200).send({ messageRetour: "Ce post est liké !" })
    } else {
      // else save this like in database
      await MyDatabase.Like.create({
        UserId: userId,
        PostId: postId,
      })
      res.status(201).json({ messageRetour: "Like Annulé !" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ ADD COMMENT -----------------

exports.addComment = async (req, res) => {
  try {
    const comment = req.body.commentMessage
    const username = req.body.commentusername
    // save this comment in the database
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
//------------------------------------------ DELETE COMMENT -----------------

exports.deleteComment = async (req, res) => {
  try {
    // try to find one user by his Id or if admin
    const userId = token.getUserId(req)
    const checkIfAdmin = await MyDatabase.User.findOne({
      where: { id: userId },
    })
    const comment = await MyDatabase.Comment.findOne({
      where: { id: req.params.id },
    })
    // if it is the owner of this comment or the admin
    if (userId === comment.UserId || checkIfAdmin.isAdmin === true) {
      MyDatabase.Comment.destroy(
        { where: { id: req.params.id } },
        { truncate: true }
      )
      res.status(200).json({ message: "commentaire supprimé" })
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
