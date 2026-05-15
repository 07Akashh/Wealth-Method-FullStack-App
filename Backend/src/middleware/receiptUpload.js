const { uploadFile } = require("../services/uploader");

const receiptUpload = (req, res, next) => {
    if (!req.file) {
        if (typeof req.body?.receipt === "string" && /^(file|content):\/\//i.test(req.body.receipt)) {
            delete req.body.receipt;
        }
        return next();
    }

    uploadFile(req.file, "cloudinary", "wealth_method/receipts")
        .then((receiptUrl) => {
            req.body.receipt = receiptUrl;
            next();
        })
        .catch((err) => next(err));
};

module.exports = receiptUpload;
