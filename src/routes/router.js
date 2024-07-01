const express = require("express");
const fileUploadController = require("../controllers/fileUploadController");
const router = express.Router();

router.post("/upload", fileUploadController.uploadFile);
router.post("/store", fileUploadController.storeFile);

module.exports = router;
