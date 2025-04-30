const express = require('express');
const router = express.Router();
const { addToCart, updateCartItem, removeFromCart, getUserCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
router.get('', getUserCart);
router.post('/add', protect, addToCart);
router.put('/:productId', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;
