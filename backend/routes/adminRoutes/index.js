import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { adminOnly } from '../../middleware/adminMiddleware.js';
import {
  getAllUsers,
  getUserById,
  blockUnblockUser,
  deleteUser,
  getUserOrders,
} from '../../controllers/adminUserController.js';
import {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  updateProductPricing,
  updateStock,
  updateVariant,
  deleteProduct,
} from '../../controllers/adminProductController.js';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryDate,
  handleReturnRequest,
} from '../../controllers/adminOrderController.js';
import {
  getWalletByUserId,
  issueRefund,
  getWalletTransactions,
} from '../../controllers/adminWalletController.js';
import { uploadProductImage as uploadProductImageHandler } from '../../controllers/uploadController.js';
import { uploadProductImage as uploadProductImageMiddleware } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

// ---------- Users ----------
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/:id/orders', getUserOrders);
router.patch('/users/:id/block', blockUnblockUser);
router.delete('/users/:id', deleteUser);

// ---------- Upload (before /products/:id) ----------
router.post('/upload/image', uploadProductImageMiddleware, uploadProductImageHandler);

// ---------- Products ----------
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', addProduct);
router.put('/products/:id', editProduct);
router.patch('/products/:id/pricing', updateProductPricing);
router.patch('/products/:id/stock', updateStock);
router.patch('/products/:id/variant', updateVariant);
router.delete('/products/:id', deleteProduct);

// ---------- Orders ----------
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/orders/:id/delivery-date', updateDeliveryDate);
router.patch('/orders/:id/return', handleReturnRequest);

// ---------- Wallet (refund before :userId) ----------
router.post('/wallet/refund', issueRefund);
router.get('/wallet/:userId/transactions', getWalletTransactions);
router.get('/wallet/:userId', getWalletByUserId);

export default router;
