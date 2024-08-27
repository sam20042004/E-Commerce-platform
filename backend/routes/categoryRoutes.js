import express from "express";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";

router.route("/").post(authenticate, authorizeAdmin, createCategory);
router
  .route("/:categoryId")
  .delete(authenticate, authorizeAdmin, deleteCategory)
  .put(authenticate, authorizeAdmin, updateCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
