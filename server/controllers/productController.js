const mongoose = require("mongoose");
const Product = require("../models/Product");

// Add Product
const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
  
    const {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      featured,
    } = req.body;

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      featured,
      images: req.file ? [`/uploads/${req.file.filename}`] : [],
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Upload Product Image
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Products
const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    // Search by Product Name
    if (keyword) {
      query.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Price
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {};

    if (sort === "price") {
      sortOption.price = 1;
    } else if (sort === "-price") {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Product
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      featured,
    } = req.body;

    const updateData = {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      featured,
    };

    // If a new image is uploaded, update it
    if (req.file) {
      updateData.images = [`/uploads/${req.file.filename}`];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Create Product Review
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review Added Successfully",
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createProduct,
  uploadProductImage,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
};