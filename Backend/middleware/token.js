const JWT = require("jsonwebtoken")
require("dotenv").config()

function issueJWT(user) {
  // on génére le token
  const id = user.id
  const expiresIn = "24H"
  const payload = {
    sub: id,
    iat: Date.now(),
  }
  const signedToken = JWT.sign(payload, process.env.SECRET_TOKEN, {
    expiresIn: expiresIn,
  })
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  }
}
function getUserId(req) {
  // on vérifie le userId du token
  const token = req.headers.authorization.split(" ")[1] // on récupère le token de la requête entrante
  const decodedToken = JWT.verify(token, process.env.SECRET_TOKEN) // on le vérifie
  const userId = decodedToken.sub
  return userId // on récupère l'id du token
}

module.exports.issueJWT = issueJWT
module.exports.getUserId = getUserId
