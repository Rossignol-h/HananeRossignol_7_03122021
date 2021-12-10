const MyDatabase = require("../models")
const bcrypt = require("bcrypt")

function createAdmin(req, res) {
  // check if an admin account already exist
  MyDatabase.User.findOne({
    where: { email: "admin@groupomania.com" } || { username: "admin" },
  })
    .then((user) => {
      // if not create one
      if (!user) {
        bcrypt
          .hash("Administrateur", 10)
          .then((hash) => {
            const admin = MyDatabase.User.create({
              username: "admin",
              email: "admin@groupomania.com",
              password: hash,
              isAdmin: true,
            })
              .then((admin) => {
                console.log({
                  admin,
                  message: `compte admin créé !`,
                })
              })
              .catch((error) => {
                res.status(400).json({ error })
              })
          })
          .catch((error) => {
            res.status(500).send({ error })
          })
      } else {
        console.log({ message: "le compte admin existe déjà !" })
      }
    })
    .catch((error) => {
      console.log({ error })
    })
}
module.exports = createAdmin()
