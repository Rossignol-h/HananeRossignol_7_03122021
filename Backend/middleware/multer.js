const multer = require("multer")

// list of accepted extension
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

// set the destination of images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "upload")
  },
  // config proper name of images
  //and add date to make them unique
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/\.[^/.]+$/, "")
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Date.now() + "." + extension)
  },
})
// export multer settings and add single method
module.exports = multer({ storage: storage }).single("upload")
