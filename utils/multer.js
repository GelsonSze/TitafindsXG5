import multer from "multer";

/**
 * Setup for image upload
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/img/items/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") cb(null, true);
    else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
};
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter,
});
