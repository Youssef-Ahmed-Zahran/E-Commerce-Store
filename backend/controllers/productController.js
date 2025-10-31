const { asyncHandler } = require("../middlewares/asyncHandler");
const { Product } = require("../models/productModel");

// Http Methods / Verbs

/**
 *   @desc   Get All Products
 *   @route  /api/products
 *   @method  Get
 *   @access  public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
/**
 *   @desc   Get Product By Id
 *   @route  /api/produts/:id
 *   @method  Get
 *   @access  public
 */
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "the product not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Add Product
 *   @route  /api/products
 *   @method  Post
 *   @access  private (Admin)
 */
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required!" });
      case !description:
        return res.status(400).json({ error: "Description is required!" });
      case !price:
        return res.status(400).json({ error: "Price is required!" });
      case !category:
        return res.status(400).json({ error: "Category is required!" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required!" });
      case !brand:
        return res.status(400).json({ error: "Brand is required!" });
    }

    const product = new Product({ ...req.fields });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Update Product
 *   @route  /api/product/:id
 *   @method  Put
 *   @access  private (Admin)
 */
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.fields,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Delete Product
 *   @route  /api/products/:id
 *   @method  Delete
 *   @access  private (Admin)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findById(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found!" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: "This product has been deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Get All Products
 *   @route  /api/products/allproducts
 *   @method  Get
 *   @access  private (Admin)
 */
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Add Product Review
 *   @route  /api/products/:id/review
 *   @method  Post
 *   @access  private (Admin)
 */
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ error: "Product already reviewed" });
      }

      const review = {
        user: req.user._id,
        name: req.user.username,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json(product);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Get Top Product
 *   @route  /api/products/top
 *   @method  Get
 *   @access  public
 */
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(4);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Get New Product
 *   @route  /api/products/new
 *   @method  Get
 *   @access  public
 */
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

/**
 *   @desc   Filter Products
 *   @route  /api/products/filtered-products
 *   @method  Get
 *   @access  public
 */
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await Product.find(args);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = {
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
};
