
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
 
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'memory-chest', // Así se llamará el folder en cloudinary
//   allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); //Esta función nombra al archivo de cloudinary como se llama el archivo originalmente
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'memory-chest', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  params: { resource_type: 'raw' },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});


 
//  const uploadCloud = multer({ storage: storage });
//  module.exports = uploadCloud;
module.exports= multer({storage})

