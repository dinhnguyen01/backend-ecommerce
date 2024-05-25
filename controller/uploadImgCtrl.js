const multer = require("multer");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Product = require("../models/productModel");
const Blog = require("../models/blogModel");
const validateMongoDbId = require("../utils/validateMongodbId");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/assets/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `image-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const configMulter = multer({ storage: storage }).array("files");
const uploadFileMiddleware = util.promisify(configMulter);

const uploadImages = asyncHandler(async (req, res) => {
  const { id, type } = req.params;
  validateMongoDbId(id);

  try {
    await uploadFileMiddleware(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    let resultFiles = req.files.map((file) => ({
      url: `/assets/uploads/${file.filename}`,
    }));

    let updatedDocument;
    if (type === "product") {
      updatedDocument = await Product.findByIdAndUpdate(
        id,
        { $push: { images: { $each: resultFiles } } },
        { new: true }
      );
    } else if (type === "blog") {
      updatedDocument = await Blog.findByIdAndUpdate(
        id,
        { $push: { images: { $each: resultFiles } } },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id, type, filename } = req.params;
  validateMongoDbId(id);

  console.log(filename);
  try {
    const filePath = path.join(__dirname, "../public/assets/uploads", filename);

    // Delete the file from the folder
    fs.unlink(filePath, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "fail", message: "File deletion failed" });
      }

      let updatedDocument;
      if (type === "product") {
        updatedDocument = await Product.findByIdAndUpdate(
          id,
          { $pull: { images: { url: `/assets/uploads/${filename}` } } },
          { new: true }
        );
      } else if (type === "blog") {
        updatedDocument = await Blog.findByIdAndUpdate(
          id,
          { $pull: { images: { url: `/assets/uploads/${filename}` } } },
          { new: true }
        );
      } else {
        return res.status(400).json({ message: "Invalid type" });
      }

      res.json({
        status: "success",
        message: "Delete success",
        document: updatedDocument,
      });
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

module.exports = { uploadImages, deleteImages };
