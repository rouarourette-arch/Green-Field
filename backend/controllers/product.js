import { Product } from "../models/index.js";

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getAllproducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ association: "category" }],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching products:", error);

    return res.status(500).json({
      message: "Error in fetching data",
    });
  }
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getproductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{ association: "category" }],
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("Error fetching product:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// ADD PRODUCT
// =====================================================

export const addproduct = async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      images,
      description,
      categoryId,
    } = req.body;

    // Only sellers can create products
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Only sellers can create products",
      });
    }

    // Normalize images
    const normalizedImages = Array.isArray(images)
      ? images
      : images
        ? [images]
        : [];

    // Create product
    const newproduct = await Product.create({
      name,
      price,
      stock,
      images: normalizedImages,
      description,
      categoryId,
      sellerId: req.user.id,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: newproduct,
    });
  } catch (error) {
    console.log("Error creating product:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findByPk(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller can only delete his own products
    if (
      req.user.role === "seller" &&
      existingProduct.sellerId !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only delete your own products",
      });
    }

    await existingProduct.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting product:", error);

    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price } = req.body;

    const existingProduct = await Product.findByPk(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller can only update his own products
    if (
      req.user.role === "seller" &&
      existingProduct.sellerId !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only update your own products",
      });
    }

    await existingProduct.update({
      stock,
      price,
    });

    const updatedproduct = await Product.findByPk(id, {
      include: [{ association: "category" }],
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedproduct,
    });
  } catch (error) {
    console.log("Error updating product:", error);

    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};


// =====================================================
// GET SELLER PRODUCTS
// =====================================================

export const getSellerProducts = async (req, res) => {
  try {
    // Only sellers can access their products
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Only sellers can access seller products",
      });
    }

    const products = await Product.findAll({
      where: {
        sellerId: req.user.id,
      },
      include: [{ association: "category" }],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log("Error fetching seller products:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};