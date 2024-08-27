import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    // We are using req.fields as we have used formidable in our middleware sectoin.
    const { name, description, price, category, quantity, brand } = req.fields;

    // validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is Required" });
      case !description:
        return res.json({ error: "Description is Required" });
      case !price:
        return res.json({ error: "Price is Required" });
      case !category:
        return res.json({ error: "Category is Required" });
      case !quantity:
        return res.json({ error: "Quantity is Required" });
      case !brand:
        return res.json({ error: "Brand is Required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is Required" });
      case !description:
        return res.json({ error: "Description is Required" });
      case !price:
        return res.json({ error: "Price is Required" });
      case !category:
        return res.json({ error: "Category is Required" });
      case !quantity:
        return res.json({ error: "Quantity is Required" });
      case !brand:
        return res.json({ error: "Brand is Required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    req.status(400).json({ error: "Server Error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    // ye jo req.query hai vo url main se data nikalne ke liye use hoti hai jaise redirect wala tha, "/product?keyword=something"
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);
    res.status(200).json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    res.status(404).json({ error: "Server Error" });
  }
});

const fetchProductbyId = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error("Error not found");
    }
  } catch (error) {
    res.status(404).json({ error: "Product Not Found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json({ ...products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Checking if this product is already reviewed by this user
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ error: "Product Already Reviewed" });
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Server Error" });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const topProducts = await Product.find({}).sort({ rating: -1 }).limit(4);

    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Server Error" });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const newProducts = await Product.find({}).sort({ creatdAt: -1 }).limit(5);

    res.json(newProducts);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductbyId,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
};
