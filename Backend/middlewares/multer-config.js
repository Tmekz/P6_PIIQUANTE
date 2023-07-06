// Multer est un middleware de gestion de fichiers. Il permet notamment aux utilisateurs de télécharger des fichiers et permet au serveur de récupérer ces fichiers.
const multer = require("multer");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/ico": "ico",
  "image/svg": "svg",
  "image/tiff": "tiff",
  "image/tif": "tif",
  "image/webp": "webp",
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
module.exports = multer({ storage }).single("image");
