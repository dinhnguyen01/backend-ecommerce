const express = require("express");
const router = express.Router();
const { uploadImages, deleteImages } = require("../controller/uploadImgCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/:type/:id", authMiddleware, isAdmin, uploadImages);
router.delete("/:type/:id/:filename", authMiddleware, isAdmin, deleteImages);

module.exports = router;
