const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const {
  createProduct,
  uploadProductImage,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require("../controllers/productController");

router.post("/", upload.single("image"), createProduct);
router.post("/upload", upload.single("image"), uploadProductImage);
router.post("/:id/reviews", protect, createProductReview);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;