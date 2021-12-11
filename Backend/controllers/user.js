const bcrypt = require("bcrypt") // chiffrement du password
//const User = require("../models")
const token = require("../middleware/token") // module qui génère le token
const fs = require("fs") // gestion des fichiers

const User = require("../models/user")
//-------------------------------------------- SIGNUP -------------------

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    })
    if (user !== null) {
      if (user.username === req.body.username) {
        return res.status(400).json({ error: "ce username est déjà utilisé" })
      }
    } else {
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.User.create({
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
    return res.status(400).send({ error: "email déjà utilisé" })
  }
}
//-------------------------------------------- LOGIN -------------------

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
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
          // on renvoie le user et le token
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
  // on trouve l'utilisateur et on renvoie l'objet user
  try {
    const user = await User.find.One({
      where: { id: req.params.id },
    })
    res.status(200).send(user)
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}

//------------------------------------------ GET ALL USER -----------------

exports.getAllUsers = async (req, res) => {
  // on envoie tous les users sauf admin
  try {
    const users = await User.findAll({
      attributes: ["username", "id", "avatar", "bio", "email"],
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
  // modifier le profil
  const id = req.params.id
  try {
    const userId = token.getUserId(req)
    let newavatar
    let user = await User.findOne({ where: { id: id } }) // on trouve le user
    if (userId === user.id) {
      if (req.file && user.avatar) {
        newavatar = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`
        const filename = user.avatar.split("/upload")[1]
        fs.unlink(`upload/${filename}`, (err) => {
          // s'il y avait déjà une avatar on la supprime
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
      if (req.body.bio) {
        user.bio = req.body.bio
      }
      if (req.body.username) {
        user.username = req.body.username
      }
      const newUser = await user.save({ fields: ["username", "bio", "avatar"] }) // on sauvegarde les changements dans la bdd
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

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findOne({ where: { id: id } })
    if (user.avatar !== null) {
      const filename = user.avatar.split("/upload")[1]
      fs.unlink(`upload/${filename}`, () => {
        // sil' y a une avatar on la supprime et on supprime le compte
        User.User.destroy({ where: { id: id } })
        res.status(200).json({ messageRetour: "utilisateur supprimé" })
      })
    } else {
      User.User.destroy({ where: { id: id } }) // on supprime le compte
      res.status(200).json({ messageRetour: "utilisateur supprimé" })
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" })
  }
}
