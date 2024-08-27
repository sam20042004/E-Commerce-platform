import express from "express";
// 'path' jo hai vo abhi apan kaunsi directory ke kaunse folder ke andar hain uske liye use hota hai
import path from "path";
import multer from "multer";

// DIFFERENCE BETWEEN MULTER AND FORMIDABLE
// Both of the are node.js module but multer is specifically used for file uploads while formidable() is used for handling form data which can contain files and text also.
// Multer allows us to configure the file storage(disk storage of memory storage) while formidable needs to be configured to do so otherwise it uses streaming file sot

const router = express.Router();
// multer acts as a helping middleware to store files in
//  backend and generates URL, which we can store in database
//  and that can be accessed anytime.

const storage = multer.diskStorage({
  // destination specifies the folder where the files should be saved.
  destination: (req, file, cb) => {
    return cb(null, "uploads/");
  },
  // 'filename' is used to customize the file name.
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // 'filetypes' is a regex that is used match valid file extensions
  const filetypes = /jpe?g|png|webp/;
  // 'mimetypes' is a regex that is used match valid mime types.
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  //   this extracts the file extension from the uploaded file.
  const extname = path.extname(file.originalname).toLowerCase();
  //   this extracts the mimetype from the uploaded file.
  const mimetype = file.mimetype;

//   this is checking whether the extension and the mimetype of the uploaded file is correct or not.
  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("images only"), false);
  }
};
// This is creating an instance of multer of defined storage and fileFilter.
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.route("/").post((req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image Uploaded Successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No Image file provided" });
    }
  });
});

export default router;
