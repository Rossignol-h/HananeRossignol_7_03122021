const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const path = require("path")
const helmet = require("helmet")
require("dotenv").config()

//routes
const userRoutes = require("./routes/users")
const postsRoutes = require("./routes/posts")

//MyDatabase
const { sequelize } = require("./models/index")

const app = express()

app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// security related
app.use(cors())
app.use(helmet())

app.use("./upload", express.static(path.join(__dirname, "./upload")))
app.use("/api/users", userRoutes)
app.use("/api/posts", postsRoutes)

module.exports = app
