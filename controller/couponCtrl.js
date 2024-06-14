const Coupon = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const getCoupons = await Coupon.find();
    res.json(getCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupons = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updatedCoupons = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupons = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedCoupons = await Coupon.findByIdAndDelete(id);
    res.json(deletedCoupons);
  } catch (error) {
    throw new Error(error);
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getAcoupon = await Coupon.findById(id);
    res.json(getAcoupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupons,
  deleteCoupons,
  getCoupon,
};
