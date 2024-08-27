import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const nameExists = await Category.findOne({ name });
    if (nameExists) {
      return res.json({ error: "This category already exists" });
    }

    const newCategory = Category({
      name: name,
    });

    try {
      const category = await newCategory.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400);
      throw new Error("Invalid name.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (category) {
      category.name = name;
      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } else {
      return res.json({ error: "Category don't exists" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    return res.status(200).json(removed);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const readCategory = asyncHandler(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
};
