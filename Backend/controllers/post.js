const token = require("../middleware/token")
//const MyDatabase = require("../models")
const fs = require("fs") //

const Post = require("../models/post")
const User = require("../models/user")
const Like = require("../models/like")
const Comment = require("../models/comment")

//------------------------------------------ CREATE POST -----------------

exports.createPost = async (req, res) => {
  const userId = token.getUserId(req)
  let imageUrl
  try {
    // try to find one user by his Id
    const user = await User.findOne({
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
      const post = await Post.create({
        include: [
          {
            model: User,
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
    let post = await Post.findOne({ where: { id: req.params.id } })
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
    const checkIfAdmin = await User.findOne({
      where: { id: userId },
    })
    const post = await Post.findOne({ where: { id: req.params.id } })
    // if it is the owner of this post or the admin
    if (userId === post.UserId || checkIfAdmin.isAdmin === true) {
      if (post.imageUrl) {
        // then if an image exist delete it
        const filename = post.imageUrl.split("/upload")[1]
        fs.unlink(`upload/${filename}`, () => {
          Post.destroy({ where: { id: post.id } })
          res.status(200).json({ message: "Post supprimé" })
        })
        // else just delete this post
      } else {
        Post.destroy({ where: { id: post.id } }, { truncate: true })
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
    const post = await Post.findOne({
      where: { id: req.params.id },
      // i want also user info & likes & comment
      include: [
        {
          model: User,
          attributes: ["username", "avatar", "id"],
        },
        {
          model: Like,
          attributes: ["PostId", "UserId"],
        },
        {
          model: Comment,
          order: [["createdAt", "DESC"]],
          attributes: ["message", "username", "UserId"],
          include: [
            {
              model: User,
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
    const posts = await Post.findAll({
      attributes: ["id", "message", "imageUrl", "link", "createdAt"],
      order: [["createdAt", "DESC"]],
      // i also want user info & likes & comment
      include: [
        {
          model: User,
          attributes: ["username", "id", "avatar"],
        },
        {
          model: Like,
          attributes: ["UserId"],
        },
        {
          model: Comment,
          attributes: ["message", "username", "UserId", "id"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
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
    const user = await Like.findOne({
      where: { UserId: userId, PostId: postId },
    })
    if (user) {
      // if there is one delete it from database
      await Like.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      )
      res.status(200).send({ messageRetour: "Ce post est liké !" })
    } else {
      // else save this like in database
      await Like.create({
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
    const newComment = await Comment.create({
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
    const checkIfAdmin = await User.findOne({
      where: { id: userId },
    })
    const comment = await Comment.findOne({
      where: { id: req.params.id },
    })
    // if it is the owner of this comment or the admin
    if (userId === comment.UserId || checkIfAdmin.isAdmin === true) {
      Comment.destroy({ where: { id: req.params.id } }, { truncate: true })
      res.status(200).json({ message: "commentaire supprimé" })
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
