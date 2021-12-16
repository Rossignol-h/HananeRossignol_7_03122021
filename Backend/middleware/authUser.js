const emailValidator = require("email-validator")
const passwordValidator = require("password-validator")

exports.valid = (req, res, next) => {
  const passwordSchema = new passwordValidator()
  passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(20) // Maximum length 20
    .has()
    .digits(1)
    .has()
    .uppercase(1) // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .not()
    .symbols() // Has no symbols
  //.has().not().spaces()

  if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    return res.status(400).send({
      error: "Merci de vérifier vos saisies",
    })
  } else if (
    emailValidator.validate(req.body.email) ||
    passwordSchema.validate(req.body.password)
  ) {
    next()
  }
}
exports.checkusername = (req, res, next) => {
  // on vérifie le username
  const regex = /^[a-zA-Z0-9_]{3,30}$/ // Lettres, espaces et doit être entre 4 et 30 caractères
  const username = req.body.username
  if (regex.test(username) === true) {
    next()
  } else {
    return res.status(400).send({
      error:
        "Votre username doit être de 3 caractères minimum et 30 maximum, sont acceptées les lettres, chiffres et underscore (_)  ",
    })
  }
}
