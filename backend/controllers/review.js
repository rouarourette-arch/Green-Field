import { Product, Review, User } from '../models/index.js';

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findByPk(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const review = await Review.create({
      productId: product.id,
      userId: req.user.id,
      rating,
      comment,
    });
    return res.status(201).json(review);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
