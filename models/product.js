const mongoose = require("mongoose");

const FIELDS_TO_EXCLUDE = ["_id", "__v"];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have name"],
  },
  price: {
    type: Number,
    required: [true, "product must have a price"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "marcos", "liddy", "caressa"],
      message: "{VALUE} is not an option",
    },
  },
});
productSchema.pre(/find/, function () {
  this.select(
    FIELDS_TO_EXCLUDE.map((el) => {
      return `-${el}`;
    }).join(" ")
  );
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
