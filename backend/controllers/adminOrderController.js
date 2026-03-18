import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
const VALID_STATUSES = [
  'order placed',
  'shipped',
  'out for delivery',
  'delivered',
  'return requested',
  'returned',
  'cancelled',
];

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (admin)
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status && VALID_STATUSES.includes(status) ? { status } : {};
  const orders = await Order.find(filter)
    .populate('customerId', 'name email phone')
    .populate('items.productId', 'productName productId thumbnails variants.images')
    .sort({ createdAt: -1 });
  res.json(orders);
});

/**
 * @route   GET /api/admin/orders/:id
 * @desc    Get single order (admin)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }
  const order = await Order.findById(req.params.id)
    .populate('customerId', 'name email phone addresses')
    .populate('items.productId', 'productName productId thumbnails variants.images');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

/**
 * @route   PATCH /api/admin/orders/:id/status
 * @desc    Update order status (admin)
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Use one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'delivered' && !order.deliveryDate) {
    order.deliveryDate = new Date();
  }
  await order.save();

  const updated = await Order.findById(order._id)
    .populate('customerId', 'name email phone');
  res.json(updated);
});

/**
 * @route   PATCH /api/admin/orders/:id/delivery-date
 * @desc    Update delivery date (admin)
 */
export const updateDeliveryDate = asyncHandler(async (req, res) => {
  const { deliveryDate } = req.body;
  if (!deliveryDate) {
    res.status(400);
    throw new Error('deliveryDate is required');
  }
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.deliveryDate = new Date(deliveryDate);
  await order.save();
  res.json(order);
});

/**
 * @route   PATCH /api/admin/orders/:id/return
 * @desc    Handle return request – set status to return requested or returned (admin)
 */
export const handleReturnRequest = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid order ID');
  }
  const { action } = req.body; // 'approve' | 'reject'
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status !== 'return requested' && order.status !== 'delivered') {
    res.status(400);
    throw new Error('Order must be delivered or have return requested to process return');
  }

  if (action === 'approve') {
    order.status = 'returned';
  } else if (action === 'reject') {
    order.status = 'delivered';
  } else {
    res.status(400);
    throw new Error('Provide action: approve or reject');
  }

  await order.save();
  res.json(order);
});

/**
 * @route   PATCH /api/admin/orders/bulk-update
 * @desc    Bulk update order statuses (admin)
 */
export const bulkUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { orderIds, status } = req.body;

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    res.status(400);
    throw new Error('No order IDs provided');
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status. Use one of: ${VALID_STATUSES.join(', ')}`);
  }

  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { status } }
  );

  // If status is delivered, we might want to update deliveryDate too
  if (status === 'delivered') {
    await Order.updateMany(
      { _id: { $in: orderIds }, deliveryDate: { $exists: false } },
      { $set: { deliveryDate: new Date() } }
    );
  }

  res.json({ message: 'Bulk update successful', modifiedCount: result.modifiedCount });
});
