const AWS = require("aws-sdk");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const config = require("../config").cfg;
const appUtils = require("../utils/appUtils");

const resolveCloudinaryCredentials = () => ({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.cloudinaryCloudName ||
    process.env.cloud_name,
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.cloudinaryApiKey ||
    process.env.api_key,
  api_secret:
    process.env.CLOUDINARY_API_SECRET ||
    process.env.cloudinaryApiSecret ||
    process.env.api_secret,
});

let cloudinaryConfigured = false;

const ensureCloudinaryConfigured = () => {
  if (cloudinaryConfigured) return;

  const credentials = resolveCloudinaryCredentials();
  if (!credentials.cloud_name || !credentials.api_key || !credentials.api_secret) {
    throw new Error(
      "Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Backend/.env.",
    );
  }

  cloudinary.config(credentials);
  cloudinaryConfigured = true;
};

// Configure S3
const s3 = new AWS.S3({
  accessKeyId: config.SES_CONFIG?.accessKeyId,
  secretAccessKey: config.SES_CONFIG?.secretAccessKey,
  region: config.SES_CONFIG?.region || "ap-south-1",
});

const __deleteTempFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Error deleting temp file ${filePath}:`, err);
    else console.log(`Temp file deleted: ${filePath}`);
  });
};

/**
 * Upload to S3
 */
const uploadToS3 = (file, folder = "uploads") => {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folder}/${Date.now()}_${path.basename(file.path)}`,
    Body: fileStream,
    ACL: "public-read",
  };

  return s3.upload(params).promise()
    .then((result) => {
      __deleteTempFile(file.path);
      return result.Location;
    })
    .catch((err) => {
      __deleteTempFile(file.path);
      throw err;
    });
};

/**
 * Upload to Cloudinary
 */
const uploadToCloudinary = (file, folder = "wealth_method") => {
  ensureCloudinaryConfigured();

  return cloudinary.uploader.upload(file.path, { folder })
    .then((result) => {
      __deleteTempFile(file.path);
      return result.secure_url;
    })
    .catch((err) => {
      __deleteTempFile(file.path);
      throw err;
    });
};

/**
 * General Upload Service
 * @param {Object} file - Express multer file
 * @param {String} provider - 's3' or 'cloudinary'
 */
const uploadFile = (file, provider = process.env.UPLOAD_PROVIDER || "cloudinary", folder) => {
  if (provider === "s3") return uploadToS3(file, folder);
  return uploadToCloudinary(file, folder);
};

module.exports = {
  uploadFile,
  uploadToS3,
  uploadToCloudinary,
};
