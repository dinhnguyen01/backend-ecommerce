const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getAllCategory,
} = require("../controller/prodcategoryCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);

router.put("/:id", authMiddleware, isAdmin, updateCategory);

router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

router.get("/:id", getaCategory);
router.get("/", getAllCategory);

module.exports = router;
