var passwordValidator = require("password-validator")

const passwordSchema = new passwordValidator()
passwordSchema // 8 à 20 caractères une maj et 1 chiffre
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase(1)
  .has()
  .digits(1)
//.has().lowercase()
//.has().symbols()
//.has().not().spaces()
//.is().not().oneOf(["Passw0rd", "Password123"])

module.exports = passwordSchema
