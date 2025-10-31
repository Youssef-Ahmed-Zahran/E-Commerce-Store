const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} = require("../controllers/orderController");

router
  .route("/")
  .post(verifyToken, createOrder)
  .get(verifyTokenAndAdmin, getAllOrders);

router.route("/mine").get(verifyToken, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(verifyToken, findOrderById);
router.route("/:id/pay").put(verifyToken, markOrderAsPaid);
router.route("/:id/deliver").put(verifyTokenAndAdmin, markOrderAsDelivered);

module.exports = router;
