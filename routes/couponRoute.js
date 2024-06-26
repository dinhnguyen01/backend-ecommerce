const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupons,
  deleteCoupons,
  getCoupon,
} = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupons);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupons);

module.exports = router;
