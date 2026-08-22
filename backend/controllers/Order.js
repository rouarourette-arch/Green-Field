import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import OrderItem from "../models/OrderItem.js";
import sequelize from "../config/database.js";
import User from "../models/User.js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const getStripeUrls = () => ({
  success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/checkout?payment=cancelled`,
});

export const createOrderFromCart = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: "Stripe is not configured on the server." });
  }

  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: {
        userId,
        cartId: cart.id,
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
        totalAmount,
        status: "pending",
        paymentStatus: "pending",
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

    await t.commit();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.CartItems.map((item) => ({
        price_data: {
          currency: "tnd",
          product_data: { name: item.Product.name },
          unit_amount: Math.round(Number(item.Product.price) * 100),
        },
        quantity: item.quantity,
      })),
      ...getStripeUrls(),
      metadata: { orderId: String(newOrder.id), userId: String(userId) },
    });

    await newOrder.update({ stripeSessionId: session.id });

    return res.status(201).json({
      message: "Checkout session created.",
      orderId: newOrder.id,
      totalAmount,
      checkoutUrl: session.url,
    });
  } catch (error) {
    await t.rollback();

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

export const handleStripeWebhook = async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).send("Stripe webhook is not configured.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid") {
    const session = event.data.object;
    const order = await Order.findOne({ where: { stripeSessionId: session.id } });
    if (order && order.paymentStatus !== "paid") {
      await sequelize.transaction(async (transaction) => {
        const orderItems = await OrderItem.findAll({ where: { orderId: order.id }, include: [Product], transaction, lock: transaction.LOCK.UPDATE });
        for (const item of orderItems) {
          if (!item.Product || item.Product.stock < item.quantity) {
            await order.update({ status: "cancelled", paymentStatus: "failed" }, { transaction });
            return;
          }
          await item.Product.decrement("stock", { by: item.quantity, transaction });
        }
        await order.update({
          status: "paid",
          paymentStatus: "paid",
          stripePaymentIntentId: session.payment_intent,
        }, { transaction });
        const cart = await Cart.findOne({ where: { id: order.cartId, userId: order.userId, status: "active" }, transaction });
        if (cart) await cart.update({ status: "completed" }, { transaction });
      });
    }
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    await Order.update({ status: "cancelled", paymentStatus: "cancelled" }, { where: { stripeSessionId: session.id, paymentStatus: "pending" } });
  }

  return res.json({ received: true });
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