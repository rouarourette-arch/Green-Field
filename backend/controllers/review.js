import { Review, User, Product } from '../models/index.js';

export const addOrUpdateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; 

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be between 1 and 5.',
      });
    }

    
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    let review = await Review.findOne({ where: { userId, productId } });

    if (review) {
      review.rating = rating;
      review.comment = comment || review.comment;
      await review.save();
      return res.status(200).json({
        success: true,
        message: 'Review updated successfully.',
        review,
      });
    }

    review = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error adding review.',
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ['id', 'name'], 
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(avgRating),
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching reviews.',
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    if (review.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    await review.destroy();
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting review.',
    });
  }
};