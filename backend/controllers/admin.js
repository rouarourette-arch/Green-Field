import { User, Product, Category, Order, OrderItem, Review, Cart, CartItem } from '../models/index.js';
import sequelize from '../config/database.js';

const productInclude = [
  { association: 'seller', attributes: ['id', 'name', 'email'] },
  { association: 'category', attributes: ['id', 'name'] },
  { model: Review, attributes: ['id', 'rating', 'comment', 'userId'] },
];

export const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalClients, totalSellers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      User.count(), User.count({ where: { role: 'client' } }), User.count({ where: { role: 'seller' } }),
      Product.count(), Order.count(), Order.sum('totalAmount', { where: { paymentStatus: 'paid' } }),
    ]);
    const statusRows = await Order.findAll({ attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']], group: ['status'], raw: true });
    return res.json({ totalUsers, totalClients, totalSellers, totalProducts, totalOrders, totalRevenue: Number(totalRevenue || 0), byStatus: statusRows });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getAdminProducts = async (req, res) => {
  try { return res.json(await Product.findAll({ include: productInclude, order: [['createdAt', 'DESC']] })); }
  catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getAdminCategories = async (req, res) => {
  try { return res.json(await Category.findAll({ include: [{ association: 'products', attributes: ['id'] }] })); }
  catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getAdminUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] }, include: [
      { model: Order, include: [{ model: OrderItem, include: [Product] }] },
      { model: Review, include: [Product] },
      { model: Cart, include: [{ model: CartItem, include: [Product] }] },
    ] });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.json(user);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getAdminSellerDetails = async (req, res) => {
  try {
    const seller = await User.findOne({ where: { id: req.params.id, role: 'seller' }, attributes: { exclude: ['password'] } });
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });
    const products = await Product.findAll({ where: { sellerId: seller.id }, include: [{ association: 'category' }, { model: Review }] });
    const orders = await Order.findAll({ include: [{ model: OrderItem, required: true, include: [{ model: Product, where: { sellerId: seller.id } }] }, User], order: [['createdAt', 'DESC']] });
    const items = orders.flatMap((order) => order.OrderItems || []);
    const soldByProduct = items.reduce((counts, item) => ({ ...counts, [item.productId]: (counts[item.productId] || 0) + item.quantity }), {});
    products.forEach((product) => {
      product.setDataValue('salesCount', soldByProduct[product.id] || 0);
      product.setDataValue('averageRating', product.Reviews?.length ? product.Reviews.reduce((sum, review) => sum + review.rating, 0) / product.Reviews.length : 0);
    });
    return res.json({ seller, products, orders, totalProducts: products.length, totalSoldItems: items.reduce((sum, item) => sum + item.quantity, 0), totalOrders: orders.length, totalRevenue: items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};
