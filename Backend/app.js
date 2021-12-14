const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const path = require("path")
const helmet = require("helmet")
require("dotenv").config()

//routes
const userRoutes = require("./routes/user")
const postsRoutes = require("./routes/posts")

//MyDatabase
const { sequelize } = require("./models/index")
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

const app = express()

app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(helmet())

app.use("/upload", express.static(path.join(__dirname, "upload")))
app.use("/api/users", userRoutes)
app.use("/api/posts", postsRoutes)

module.exports = app
