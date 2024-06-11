const express = require("express");
const router = express.Router();
const {
  upload_preImages,
  delete_preImages,
  uploadImages,
  deleteImages,
} = require("../controller/uploadImgCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, upload_preImages);
router.delete("/delete/:filename", authMiddleware, isAdmin, delete_preImages);
router.post("/:type/:imageType/:id", authMiddleware, isAdmin, uploadImages);
router.delete(
  "/delete/:type/:imageType/:id/:filename",
  authMiddleware,
  isAdmin,
  deleteImages
);

module.exports = router;
