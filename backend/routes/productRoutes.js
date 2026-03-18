import express from 'express';
const router = express.Router();
import { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getBrands, getColors } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/colors', getColors);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;
