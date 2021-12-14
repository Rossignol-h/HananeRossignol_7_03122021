const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    const userId = decodedToken.sub
    if (req.body.userId && req.body.userId !== userId) {
      ;("403: Requête non autorisée !")
    } else {
      next()
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Requête invalide !") })
  }
}
