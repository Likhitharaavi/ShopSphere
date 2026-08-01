const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// Add Product to Cart
router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCartQuantity);
router.delete("/:id", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;