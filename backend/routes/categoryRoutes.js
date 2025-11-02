const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  getCategoryById,
} = require("../controllers/categoryController");

router.get("/categories", verifyToken , listCategory);

router.get("/:id", getCategoryById);

router.post("/", verifyTokenAndAdmin, createCategory);

router
  .route("/:categoryId")
  .put(verifyTokenAndAdmin, updateCategory)
  .delete(verifyTokenAndAdmin, deleteCategory);

module.exports = router;
