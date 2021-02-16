const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
 
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'memory-chest', // Así se llamará el folder en cloudinary
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Esta función nombra al archivo de cloudinary como se llama el archivo originalmente
  }
});
 
const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud;

