const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(process.cwd(), "tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const safeName = (file.originalname || "receipt.jpg").replace(/\s+/g, "_");
        cb(null, `${Date.now()}_${safeName}`);
    },
});

const fileFilter = (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
        return;
    }
    cb(new Error("Only image uploads are allowed for receipts."));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

module.exports = upload;
