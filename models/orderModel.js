const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {
      id: String,
      method: String,
      amount: Number,
      status: String,
      created: Date,
      currency: {
        type: String,
        default: "vnđ",
      },
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: ["Processing", "Dispatched", "Cancelled", "Delivered"],
    },
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
