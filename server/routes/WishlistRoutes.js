const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} = require("../controllers/wishlistController");

// Add Product
router.post("/", protect, addToWishlist);

// Get Wishlist
router.get("/", protect, getWishlist);

// Remove Item
router.delete("/:id", protect, removeWishlistItem);

// Clear Wishlist
router.delete("/", protect, clearWishlist);

module.exports = router;