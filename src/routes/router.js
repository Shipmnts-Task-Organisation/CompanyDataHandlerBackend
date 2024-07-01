const express = require("express");
const fileUploadController = require("../controllers/fileUploadController");
const router = express.Router();

// if upload is there in url then it'll be redirected to uploadFile function
router.post("/upload", fileUploadController.uploadFile);

// if upload is there in url then it'll be redirected to storeFile function
router.post("/store", fileUploadController.storeFile);

module.exports = router;
