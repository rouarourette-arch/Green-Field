import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { getSellerProducts } from '../controllers/product.js';
import { getSellerOrders } from '../controllers/Order.js';
import { Product, Order, OrderItem } from '../models/index.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('seller'));
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
const getStats = async (req, res) => {
	try {
		const products = await Product.findAll({ where: { sellerId: req.user.id } });
		const orders = await Order.findAll({ include: [{ model: OrderItem, required: true, include: [{ model: Product, where: { sellerId: req.user.id } }] }] });
		const items = orders.flatMap((order) => order.OrderItems || []);
		return res.json({ totalProducts: products.length, totalSoldItems: items.reduce((sum, item) => sum + item.quantity, 0), totalOrders: orders.length, totalRevenue: items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), pendingOrders: orders.filter((order) => order.status === 'pending').length, processingOrders: orders.filter((order) => order.status === 'processing').length, deliveredOrders: orders.filter((order) => order.status === 'delivered').length });
	} catch (error) { return res.status(500).json({ message: error.message }); }
};
router.get('/dashboard', getStats);
router.get('/statistics', getStats);
export default router;
