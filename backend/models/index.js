import Product from "./product.js";
import Category from "./category.js";
import User from "./User.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Review from "./Review.js";

// =====================================================
// CATEGORY ↔ PRODUCT
// =====================================================

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// USER ↔ CART
// =====================================================

User.hasOne(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// CART ↔ CART ITEMS
// =====================================================

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// PRODUCT ↔ CART ITEMS
// =====================================================

Product.hasMany(CartItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// USER ↔ PRODUCT (SELLER)
// =====================================================

User.hasMany(Product, {
  foreignKey: "sellerId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// PRODUCT ↔ REVIEW
// =====================================================

Product.hasMany(Review, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// USER ↔ REVIEW
// =====================================================

User.hasMany(Review, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// =====================================================
// EXPORTS
// =====================================================

export {
  User,
  Product,
  Category,
  Cart,
  CartItem,
  Review,
};