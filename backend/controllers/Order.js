
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";   
import Product from "../models/product.js";
import Order from "../models/order.js";
import OrderItem from "../models/OrderItem.js";
import sequelize from "../config/database.js";  


// 1. Créer une commande à partir du panier (Checkout)
exports.createOrderFromCart = async (req, res) => {
  // Utilisation d'une transaction pour garantir l'intégrité
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;

    // Récupérer le panier actif avec ses articles et les détails des produits
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
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
      return res.status(400).json({ message: "Votre panier est vide" });
    }

    // Calcul du montant total
    const totalAmount = cart.CartItems.reduce((sum, item) => {
      return sum + item.quantity * item.Product.price;
    }, 0);

    // 1. Créer la commande (Order)
    const newOrder = await Order.create(
      {
        userId,
        totalAmount,
        status: "paid", // ou "pending" selon la logique de paiement
      },
      { transaction: t }
    );

    // 2. Transférer chaque CartItem vers OrderItem
    const orderItemsData = cart.CartItems.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.price, // Stocker le prix à l'instant T
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // 3. Vider/Marquer le panier comme "completed"
    cart.status = "completed";
    await cart.save({ transaction: t });

    // Valider la transaction
    await t.commit();

    return res.status(201).json({
      message: "Commande créée avec succès !",
      orderId: newOrder.id,
      totalAmount,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

// 2. Récupérer l'historique des commandes de l'utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
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
    return res.status(500).json({ error: error.message });
  }
};