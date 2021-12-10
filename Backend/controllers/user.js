const bcrypt = require("bcrypt")
const MyDatabase = require("../models")
const passwordCheker = require("../models/password")
const token = require("../middleware/token")
const fs = require("fs")

//-------------------------------------------- SIGNUP -------------------

exports.signup = async (req, res) => {
  if (!passwordCheker.validate(req.body.password)) {
    return res.status(400).json({ error: "Mot de passe non securisé !" })
  } else {
    try {
      const user = await MyDatabase.User.findOne({
        where: { email: req.body.email },
      })
      if (user !== null) {
        if (user.username === req.body.username) {
          return res.status(400).json({ error: "ce username est déjà utilisé" })
        }
      } else {
        const encryptedEmail = CryptoJS.HmacSHA256(
          req.body.email,
          process.env.SECRET_CRYPTOJS
        ).toString()
        const hash = await bcrypt.hash(req.body.password, 10)
        const newUser = await MyDatabase.User.create({
          username: req.body.username,
          email: encryptedEmail,
          password: hash,
          isAdmin: false,
        })
        res.status(201).send({
          user: newUser,
          message: `Votre compte est bien créé !`,
        })
      }
    } catch (error) {
      return res.status(400).send({ error: "email déjà utilisé" })
    }
  }
}
//-------------------------------------------- LOGIN -------------------

exports.login = async (req, res) => {
  // chek if this email is already in database
  const encryptedEmail = CryptoJS.HmacSHA256(
    req.body.email,
    process.env.SECRET_CRYPTOJS
  ).toString()
  try {
    const user = await MyDatabase.User.findOne({
      where: { email: encryptedEmail },
    })
    // if not error
    if (user === null) {
      return res.status(403).send({ error: "Connexion échouée" })
    } else {
      // if find one: bcrypt will compare passwords
      const hash = await bcrypt.compare(req.body.password, user.password) //
      if (!hash) {
        return res.status(401).send({ error: "Mot de passe incorrect !" })
      } else {
        // then Jsonwebtoken will create a token
        const tokenObject = await token.issueJWT(user)
        res.status(200).send({
          user: user,
          token: tokenObject.token,
          sub: tokenObject.sub,
          expires: tokenObject.expiresIn,
          message: "Bonjour " + user.username + " !",
        })
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
//------------------------------------------ GET ONE USER -----------------

exports.getOneUser = async (req, res) => {
  // find user by his Id
  try {
    const user = await MyDatabase.User.findOne({
      where: { id: req.params.id },
    })
    res.status(200).send(user)
  } catch (error) {
    return res.status(500).send({ error: "utilisateur inconnu " })
  }
}

//------------------------------------------ GET ALL USER -----------------

exports.getAllUsers = async (req, res) => {
  //
  try {
    const users = await MyDatabase.User.findAll({
      attributes: ["username", "id", "avatar", "email"],
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
    })
    res.status(200).send(users)
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
    // try to find this user by his Id
    let user = await MyDatabase.User.findOne({ where: { id: id } })
    if (userId === user.id) {
      // add new avatar
      if (req.file && user.avatar) {
        newavatar = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`
        // delete the old one from "upload"
        const filename = user.avatar.split("/upload")[1]
        fs.unlink(`upload/${filename}`, (err) => {
          if (err) console.log(err)
          else {
            console.log(`Deleted file: upload/${filename}`)
          }
        })
      } else if (req.file) {
        newavatar = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`
      }
      if (newavatar) {
        user.avatar = newavatar
      }
      if (req.body.username) {
        user.username = req.body.username
      }
      // update avatar + username to the database
      const newUser = await user.save({ fields: ["username", "avatar"] })
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      })
    } else {
      res
        .status(400)
        .json({ messageRetour: "Vous n'avez pas les droits requis" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//------------------------------------------ DELETE USER -----------------

exports.deleteAccount = async (req, res) => {
  try {
    // try to find this user by his id in database
    const id = req.params.id
    const user = await MyDatabase.User.findOne({ where: { id: id } })
    // delete the avatar if there is one in "upload"
    if (user.avatar !== null) {
      const filename = user.avatar.split("/upload")[1]
      fs.unlink(`upload/${filename}`, () => {
        // delete this user from database
        MyDatabase.User.destroy({ where: { id: id } })
        res.status(200).json({ messageRetour: "utilisateur supprimé" })
      })
      // if no avatar just delete from database
    } else {
      MyDatabase.User.destroy({ where: { id: id } })
      res.status(200).json({ messageRetour: "utilisateur supprimé" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
