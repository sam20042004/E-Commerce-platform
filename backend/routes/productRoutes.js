import express from "express";
import formidable from "express-formidable";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductbyId,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

// formidable is similar to multer, it comes in picture when whenever
//  form data is parsed over the api, formidable() is a middleware that
//  stores all the text fiels in req.fields and all the files in req.files.
router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);

router
  .route("/:id/reviews")
  .post(authenticate, checkId, addProductReview);

router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductbyId)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);
export default router;
