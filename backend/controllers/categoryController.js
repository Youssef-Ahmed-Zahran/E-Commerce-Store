const { Category } = require("../models/categoryModel");
const { asyncHandler } = require("../middlewares/asyncHandler");

// Http Methods / Verbs

/**
 *   @desc   Get All Category
 *   @route  /api/category/categories
 *   @method  Get
 *   @access  private (Admin)
 */
const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Get Category By Id
 *   @route  /api/categories/:id
 *   @method  Get
 *   @access  public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({ message: "the category not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Create Category
 *   @route  /api/category
 *   @method  Post
 *   @access  private (Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ error: "This category already exists!" });
    }

    const createdCategory = new Category({ name });

    const newCategory = await createdCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Update Category
 *   @route  /api/category
 *   @method  Put
 *   @access  private (Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "This category not found" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      category,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Delete Category
 *   @route  /api/category/:categoryId
 *   @method  Delete
 *   @access  private (Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "This category not found" });
    }

    await Category.findByIdAndDelete(req.params.categoryId);

    res
      .status(200)
      .json({ success: "This category has been deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  listCategory,
};
