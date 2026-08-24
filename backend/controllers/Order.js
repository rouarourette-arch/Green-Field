import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import OrderItem from "../models/OrderItem.js";
import sequelize from "../config/database.js";
import User from "../models/User.js";

export const createOrderFromCart = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: {
        userId,
        status: "active",
      },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
      transaction: t,
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await t.rollback();

      return res.status(400).json({
        message: "Votre panier est vide",
      });
    }

    const unavailableItem = cart.CartItems.find((item) => !item.Product || item.quantity > item.Product.stock);
    if (unavailableItem) {
      await t.rollback();
      return res.status(409).json({ message: `${unavailableItem.Product?.name || "A product"} is no longer available in the requested quantity.` });
    }

    const totalAmount = cart.CartItems.reduce((sum, item) => {
      return sum + Number(item.quantity) * Number(item.Product.price);
    }, 0);

    const newOrder = await Order.create(
      {
        userId,
        cartId: cart.id,
        totalAmount,
        status: "paid",
        paymentStatus: "paid",
      },
      {
        transaction: t,
      }
    );

    const orderItemsData = cart.CartItems.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData, {
      transaction: t,
    });

    for (const item of cart.CartItems) {
      await item.Product.decrement("stock", {
        by: item.quantity,
        transaction: t,
      });
    }

    await cart.update({ status: "completed" }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Order confirmed successfully.",
      orderId: newOrder.id,
      totalAmount,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();

    console.error("Error creating order:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const orderIncludes = (sellerId) => [{
  model: User,
  attributes: ["id", "name", "email"],
}, {
  model: OrderItem,
  required: Boolean(sellerId),
  include: [{
    model: Product,
    ...(sellerId ? { where: { sellerId } } : {}),
    include: [{ association: "category", attributes: ["id", "name"] }, { association: "seller", attributes: ["id", "name", "email"] }],
  }],
}];

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: orderIncludes() });
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (req.user.role === "client" && order.userId !== req.user.id) return res.status(403).json({ message: "Forbidden access." });
    if (req.user.role === "seller" && !(order.OrderItems || []).some((item) => item.Product?.sellerId === req.user.id)) return res.status(403).json({ message: "Forbidden access." });
    return res.json(order);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: orderIncludes(), order: [["createdAt", "DESC"]] });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: orderIncludes(req.user.id), order: [["createdAt", "DESC"]] });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const allowedStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
  if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status." });
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });
  await order.update({ status: req.body.status });
  return res.json(order);
};