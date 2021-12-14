const router = require("express").Router()
const userCtrl = require("../controllers/user")
const authUser = require("../middleware/authUser")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

router.post("/signup", authUser.checkusername, authUser.valid, userCtrl.signup)
router.post("/login", authUser.valid, userCtrl.login)
router.put("/profile/:id", auth, multer, userCtrl.updateUser)
router.get("/profile/:id", auth, userCtrl.getOneUser)
router.delete("/profile/:id", auth, userCtrl.deleteUser)

module.exports = router
