const AppError = require("../utils/appError");
const Product = require("../models/product");

exports.getAllProducts = async (req, res, next) => {
  const { name, price, featured, rating, company, sort, limit, page } =
    req.query;
  const queryObject = {};
  const sortObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (price) {
    if (price.startsWith("-")) {
      queryObject.price = { $lte: price.slice(1) };
    } else if (price.startsWith("+")) {
      queryObject.price = { $gte: price.slice(1) };
    } else {
      queryObject.price = { $eq: price };
    }
  }

  if (featured) {
    queryObject.featured = featured === "true";
  }

  if (rating) {
    if (rating.startsWith("-")) {
      queryObject.rating = { $lte: rating.slice(1) };
    } else if (rating.startsWith("+")) {
      queryObject.rating = { $gte: rating.slice(1) };
    } else {
      queryObject.rating = { $eq: rating };
    }
  }

  if (company) {
    queryObject.company = company.split(",").join(" ");
  }

  if (sort) {
    const sortBy = sort.split(",");
    sortBy.forEach((el) => {
      sortObject[el] = el.startsWith("-") ? -1 : 1;
    });
  }

  const skip = ((page * 1 || 1) - 1) * (limit * 1 || 10);

  const products = await Product.find(queryObject)
    .sort(sortObject ? sortObject : { createdAt: -1 })
    .limit(limit ? limit : 10)
    .skip(skip);

  return res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
};
