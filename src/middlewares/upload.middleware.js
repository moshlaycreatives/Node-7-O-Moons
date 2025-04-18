import { BadRequestException } from "../errors/index.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// =============================================
// 1. Custom storage configuration
// =============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "public/uploads";

    if (file.fieldname === "images") {
      uploadPath = "public/images";
    } else if (file.fieldname === "test_report") {
      uploadPath = "public/reports";
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${uniqueSuffix}${ext}`);
  },
});

// =============================================
// 2. File filter configuration
// =============================================
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "images") {
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(
        new BadRequestException("Only JPG, JPEG, and PNG images are allowed"),
        false
      );
    }
  } else if (file.fieldname === "test_report") {
    if (ext !== ".pdf") {
      return cb(
        new BadRequestException("Only PDF files are allowed for reports"),
        false
      );
    }
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

// =============================================
// Handle multiple fields in single form
// =============================================
export const productUpload = upload.fields([
  { name: "images", maxCount: 3 },
  { name: "report", maxCount: 1 },
]);
