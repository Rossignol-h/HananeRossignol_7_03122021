const router = require("express").Router()
const userCtrl = require("../controllers/user")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

router.post("/signup", authUser.checkusername, authUser.valid, userCtrl.signup)
router.post("/login", authUser.valid, userCtrl.login)
router.get("/Profile/:id", auth, userCtrl.getOneUser)
router.get("/Profiles", auth, userCtrl.getAllUsers)
router.put("/Profile/:id", auth, multer, userCtrl.updateUser)
router.delete("/Profile/:id", auth, userCtrl.deleteUser)

module.exports = router
