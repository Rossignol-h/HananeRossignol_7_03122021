require("dotenv").config()

const Sequelize = require("sequelize")
const sequelize = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASSWORD}`,
  {
    dialect: "mysql",
    host: "localhost",
  }
)
//------------------------------------ CONNEXION & SYNCHRONIZE TEST ------

sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion to database is a success !")
  })
  .catch((error) => console.log(`Failed to access database : ${error}`))

sequelize
  .sync()
  .then(() => {
    console.log("All models were synchronized successfully !")
  })
  .catch((error) => console.log(`Failed to synchronized  : ${error}`))

//---------------------------------------- EXPORT ---------------------
module.exports = sequelize
