const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");

const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.get("/all", protect, admin,getAllOrders);
router.put("/:id/status", protect, admin,updateOrderStatus);
router.get("/:id", protect, getSingleOrder);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;