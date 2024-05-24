const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controller/uploadImgCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Route to upload images for product or blog
router.post("/:type/:id", authMiddleware, isAdmin, uploadImages);

module.exports = router;
