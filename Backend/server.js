const http = require("http")
const app = require("./app")
const MyDatabase = require("./models")

// set the PORT value to a string or number
const normalizePort = (val) => {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

//use the given PORT
const port = normalizePort(process.env.PORT || "3000")
app.set("port", port)

// error management
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error
  }
  const address = server.address()
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + " is already in use.")
      process.exit(1)
      break
    default:
      throw error
  }
}

const server = http.createServer(app)

// sync to the database to add function is the user an admin
MyDatabase.sequelize.sync().then(function () {
  server.on("error", errorHandler)
  server.on("listening", () => {
    const address = server.address()
    const bind =
      typeof address === "string" ? "pipe " + address : "port " + port
    console.log("Listening on " + bind)
  })
  server.listen(port)
  require("./config/admin_config")
})
