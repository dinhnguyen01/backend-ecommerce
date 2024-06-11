const multer = require("multer");
const path = require("path");
const util = require("util");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Product = require("../models/productModel");
const Blog = require("../models/blogModel");
const { v4: uuidv4 } = require("uuid");
const validateMongoDbId = require("../utils/validateMongodbId");

const generateUniqueFileName = (file) => {
  const ext = file.mimetype.split("/")[1];
  const uniqueID = uuidv4();
  return `image-${file.fieldname}-${Date.now()}-${uniqueID}.${ext}`;
};

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/assets/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, generateUniqueFileName(file));
  },
});

const configMulter = multer({ storage: storage }).array("files");
const uploadFileMiddleware = util.promisify(configMulter);

const upload_preImages = asyncHandler(async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    let resultFiles = [];

    // Lặp qua từng file và xử lý đồng thời
    for (let file of req.files) {
      resultFiles.push({ url: `/assets/uploads/${file.filename}` });
    }

    res.json({ message: "upload success", resultFiles });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

const delete_preImages = asyncHandler(async (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(__dirname, "../public/assets/uploads", filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ status: "fail", message: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ status: "fail", message: err.message });
      }

      res.json({ status: "success", message: "File deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id, type, imageType } = req.params;
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
      if (imageType === "primary") {
        updatedDocument = await Product.findByIdAndUpdate(
          id,
          { primaryImage: resultFiles[0].url },
          { new: true }
        );
      } else if (imageType === "secondary") {
        updatedDocument = await Product.findByIdAndUpdate(
          id,
          { $push: { images: { $each: resultFiles } } },
          { new: true }
        );
      } else {
        return res.status(400).json({ message: "Invalid imageType" });
      }
    } else if (type === "blog") {
      if (imageType === "primary") {
        updatedDocument = await Blog.findByIdAndUpdate(
          id,
          { primaryImage: resultFiles[0].url },
          { new: true }
        );
      } else if (imageType === "secondary") {
        updatedDocument = await Blog.findByIdAndUpdate(
          id,
          { $push: { images: { $each: resultFiles } } },
          { new: true }
        );
      } else {
        return res.status(400).json({ message: "Invalid imageType" });
      }
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id, type, imageType, filename } = req.params; // Adding imageType to params
  validateMongoDbId(id);

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
        if (imageType === "primary") {
          updatedDocument = await Product.findByIdAndUpdate(
            id,
            { primaryImage: null },
            { new: true }
          );
        } else if (imageType === "secondary") {
          updatedDocument = await Product.findByIdAndUpdate(
            id,
            { $pull: { images: { url: `/assets/uploads/${filename}` } } },
            { new: true }
          );
        } else {
          return res.status(400).json({ message: "Invalid imageType" });
        }
      } else if (type === "blog") {
        if (imageType === "primary") {
          updatedDocument = await Blog.findByIdAndUpdate(
            id,
            { primaryImage: null },
            { new: true }
          );
        } else if (imageType === "secondary") {
          updatedDocument = await Blog.findByIdAndUpdate(
            id,
            { $pull: { images: { url: `/assets/uploads/${filename}` } } },
            { new: true }
          );
        } else {
          return res.status(400).json({ message: "Invalid imageType" });
        }
      } else {
        return res.status(400).json({ message: "Invalid type" });
      }

      res.json({
        status: "success",
        message: "Delete success",
      });
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
});

module.exports = {
  upload_preImages,
  delete_preImages,
  uploadImages,
  deleteImages,
};
