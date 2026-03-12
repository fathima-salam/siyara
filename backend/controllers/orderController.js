import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create new order (supports Cash on Delivery and Razorpay as method option)
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }
    const items = orderItems.map((oi) => ({
        productId: oi.product,
        color: oi.color || '',
        size: oi.size || '',
        quantity: Number(oi.qty) || 1,
        price: Number(oi.price) || 0,
    }));
    const total = Number(totalPrice) || 0;
    const deliveryAmount = Number(shippingPrice) || 0;
    const payment = (paymentMethod && String(paymentMethod).toLowerCase()) || 'cod';
    const order = new Order({
        customerId: req.user._id,
        items,
        shippingAddress: shippingAddress || {},
        status: 'order placed',
        total,
        discount: 0,
        finalPrice: total,
        deliveryAmount,
        transactionDetails: {
            paymentMethod: payment,
            paymentStatus: payment === 'cod' ? 'pay_on_delivery' : 'pending',
        },
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ customerId: req.user._id })
        .populate('items.productId', 'productName product thumbnails variants')
        .sort({ orderDate: -1 });
    res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('customerId', 'name email')
        .populate('items.productId', 'productName product thumbnails variants');
    if (order) {
        const po = order.toObject();
        po.user = po.customerId;
        po.orderItems = (po.items || []).map((it) => {
            const p = it.productId;
            const name = p?.productName || p?.product || 'Product';
            const image = p?.thumbnails?.[0] || p?.variants?.[0]?.images?.[0];
            return { name, image, qty: it.quantity, price: it.price, color: it.color, size: it.size || '' };
        });
        po.totalPrice = po.finalPrice;
        po.itemsPrice = po.total;
        po.shippingPrice = po.deliveryAmount;
        po.isPaid = po.transactionDetails?.paymentStatus === 'paid';
        po.paidAt = po.transactionId ? new Date() : null;
        po.isDelivered = po.status === 'delivered';
        res.json(po);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid (e.g. after Razorpay/Stripe success)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (!order.transactionDetails) order.transactionDetails = {};
        order.transactionDetails.paymentStatus = 'paid';
        order.transactionId = req.body.transactionId || req.body.id || '';
        const updatedOrder = await order.save();
        const po = updatedOrder.toObject();
        po.isPaid = true;
        po.paidAt = new Date();
        res.json(po);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered (Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = 'delivered';
        order.deliveryDate = new Date();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('customerId', 'id name email').sort({ orderDate: -1 });
    res.json(orders);
});

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + (order.finalPrice || 0), 0);
    const totalOrders = orders.length;

    const User = (await import('../models/userModel.js')).default;
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        totalCustomers,
        avgOrderValue: avgOrderValue.toFixed(2),
        trends: {
            revenue: "+12.5%",
            orders: "+3.2%",
            customers: "+5.0%",
            avgValue: "+8.4%"
        }
    });
});

export { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders, getDashboardStats };
