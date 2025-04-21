import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryConfig from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "avif", "webp"],
  },
  transformation: [{ width: 500, height: 500, crop: "limit" }], //resizing the images to square
  public_id: (req, file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return `product-${uniqueSuffix}`;
  } // this is the filenane given to image in cloudinary. "PRODUCT" + Date + Random 
});


//this is the upload function
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, next) => {
        if (file.mimetype.startsWith('image/')) {
            next(null, true);
        } else {
            next(new Error('Not an image! Please upload an image.'), false);
        }
    }
}).array('images', 10);



//removed the followiing code and added an erroor handling middleware

// //this is added because error not ologged properly. Logging object Object expres error. WHY????
// const uploadMiddleware = (req, res, next) => {
//     upload(req, res, function(err) {
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading
//             return res.status(HTTP_CODES.BAD_REQUEST).json({
//                 success: false,
//                 message: "File upload error",
//                 error: err.message
//             });
//         } else if (err) {
//             // An unknown error occurred
//             return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: "Error uploading files",
//                 error: err.message
//             });
//         }
//         // Everything went fine
//         next();
//     });
// };

// export default uploadMiddleware;
