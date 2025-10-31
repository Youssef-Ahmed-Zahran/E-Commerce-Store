const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const checkId = require("../middlewares/checkId");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} = require("../controllers/productController");

router
  .route("/")
  .post(verifyTokenAndAdmin, formidable(), addProduct)
  .get(getAllProducts);

// Admin
router.route("/allproducts").get(verifyTokenAndAdmin, fetchAllProducts);
router.route("/:id/reviews").post(verifyToken, checkId, addProductReview);

router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .put(verifyTokenAndAdmin, formidable(), updateProduct)
  .delete(verifyTokenAndAdmin, deleteProduct);

router.route("/filtered-products").post(filterProducts);

module.exports = router;
