const { Cart, CartItem, Product } = require("../models");

// Fonction interne pour récupérer ou créer le panier actif de l'utilisateur
const getOrCreateActiveCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId, status: "active" } });
  if (!cart) {
    cart = await Cart.create({ userId, status: "active" });
  }
  return cart;
};


exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    return res.status(200).json(cart || { items: [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 2. Ajouter un produit dans CartItem (ou augmenter sa quantité)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const cart = await getOrCreateActiveCart(userId);

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += parseInt(quantity, 10);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity, 10),
      });
    }

    return res.status(200).json({ message: "product added to cart", cartItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId, status: "active" } });
    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable" });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "product not found" });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.status(200).json({ message: "product deleted from cart" });
    }

    cartItem.quantity = parseInt(quantity, 10);
    await cartItem.save();

    return res.status(200).json({ message: "product quantity updated", cartItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 4. Supprimer un CartItem du panier
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId, status: "active" } });
    if (!cart) {
      return res.status(404).json({ message: "Panier introuvable" });
    }

    await CartItem.destroy({ where: { cartId: cart.id, productId } });

    return res.status(200).json({ message: "Article supprimé du panier" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 5. Valider la commande (Checkout)
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
      include: [CartItem],
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Le panier est vide" });
    }

    // Passer le statut à completed
    cart.status = "completed";
    await cart.save();

    return res.status(200).json({ message: "Commande validée avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};