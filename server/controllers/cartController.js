const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add Product to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cartItem = await Cart.findOne({
      user: req.user.id,
      product: productId,
    });

    // Product already exists in cart
    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items are available in stock`,
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem,
      });
    }

    // New product added to cart
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items are available in stock`,
      });
    }

    const newCartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartItem: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Logged-in User Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      totalItems: cart.length,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Cart Quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(cartItem.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items are available in stock`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Cart Item
const removeCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};