const bcrypt = require("bcrypt") // create hashed password
const MyDatabase = require("../models") // database settings
const token = require("../middleware/token") // create & verify token
const fs = require("fs") // file management
require("dotenv").config() // loads environment variables

//-------------------------------------------- SIGNUP -------------------

exports.signup = async (req, res) => {
  try {
    const user = await MyDatabase.User.findOne({
      where: { email: req.body.email },
    })
    if (user !== null) {
      if (user.username === req.body.username) {
        return res.status(400).json({ error: "ce username est déjà utilisé" })
      }
    } else {
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await MyDatabase.User.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        isAdmin: false,
      })
      res.status(201).send({
        user: newUser,
        message: `Votre compte est bien créé !`,
      })
    }
  } catch (error) {
    res.status(400).json({ message: "Cet Email est déjà utilisé !" })
  }
}
//-------------------------------------------- LOGIN -------------------

exports.login = async (req, res) => {
  try {
    const user = await MyDatabase.User.findOne({
      where: { email: req.body.email },
    })
    if (user === null) {
      return res.status(403).send({ error: "Connexion échouée" })
    } else {
      const hash = await bcrypt.compare(req.body.password, user.password) //
      if (!hash) {
        return res.status(401).send({ error: "Mot de passe incorrect !" })
      } else {
        const tokenObject = await token.issueJWT(user)
        res.status(200).send({
          user: user,
          token: tokenObject.token,
          sub: tokenObject.sub,
          expires: tokenObject.expiresIn,
        })
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ GET ONE USER -----------------

exports.getOneUser = async (req, res) => {
  try {
    // try to find this user buy his ID
    const user = await MyDatabase.User.findOne({
      where: { id: req.params.id },
    })
    res.status(200).send(user)
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//------------------------------------------ UPDATE USER -----------------

exports.updateUser = async (req, res) => {
  const id = req.params.id
  try {
    const userId = token.getUserId(req)
    let newavatar
    let user = await MyDatabase.User.findOne({ where: { id: id } })
    if (userId === user.id) {
      if (req.file && user.avatar) {
        newavatar = `${req.protocol}://${req.get("host")}/upload/${
          req.file.filename
        }`
        const filename = user.avatar.split("/upload")[1]
        fs.unlink(`upload/${filename}`, (err) => {
          if (err) console.log(err)
          else {
            console.log(`Deleted file: upload/${filename}`)
          }
        })
      } else if (req.file) {
        newavatar = `${req.protocol}://${req.get("host")}/upload/${
          req.file.filename
        }`
      }
      if (newavatar) {
        user.avatar = newavatar
      }

      if (req.body.username) {
        user.username = req.body.username
      }
      const newUser = await user.save({ fields: ["username", "avatar"] }) //
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      })
    } else {
      res
        .status(401)
        .json({ messageRetour: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//------------------------------------------ DELETE USER -----------------

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await MyDatabase.User.findOne({ where: { id: id } })
    if (user.avatar !== null) {
      const filename = user.avatar.split("/upload")[1]
      fs.unlink(`upload/${filename}`, () => {
        MyDatabase.User.destroy({ where: { id: id } })
        res.status(200).json({ messageRetour: "utilisateur supprimé" })
      })
    } else {
      MyDatabase.User.destroy({ where: { id: id } })
      res.status(200).json({ messageRetour: "utilisateur supprimé" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
