const router = require("express").Router()
const userCtrl = require("../controllers/user")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

router.post("/signup", authUser.checkusername, authUser.valid, userCtrl.signup)
router.post("/login", authUser.valid, userCtrl.login)
router.get("/profile/:id", auth, userCtrl.getOneUser)
router.get("/profiles", auth, userCtrl.getAllUsers)
router.put("/profile/:id", auth, multer, userCtrl.updateUser)
router.delete("/profile/:id", auth, userCtrl.deleteUser)

module.exports = router
