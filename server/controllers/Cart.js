const { Cart, CartItem, Product } = require("../models");

// Internal function to get or create the active cart for the user
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

// 2. Add a product to CartItem (or increase its quantity)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const cart = await getOrCreateActiveCart(userId);

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
      return res.status(404).json({ message: "Cart not found" });
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

// 4. Remove a CartItem from the cart
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId, status: "active" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.destroy({ where: { cartId: cart.id, productId } });

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 5. Validate order (Checkout)
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
      include: [CartItem],
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Update status to completed
    cart.status = "completed";
    await cart.save();

    return res.status(200).json({ message: "Order validated successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};