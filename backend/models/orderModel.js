import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    color: { type: String, required: true, trim: true },
    size: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const transactionDetailsSchema = new mongoose.Schema(
  {
    paymentMethod: { type: String, trim: true },
    paymentStatus: { type: String, trim: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema },
    status: {
      type: String,
      enum: [
        'order placed',
        'shipped',
        'out for delivery',
        'delivered',
        'return requested',
        'returned',
        'cancelled',
      ],
      default: 'order placed',
    },
    orderDate: { type: Date, default: Date.now },
    shippingMethod: { type: String, trim: true },
    total: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    finalPrice: { type: Number, required: true, min: 0 },
    deliveryAmount: { type: Number, default: 0, min: 0 },
    transactionId: { type: String, trim: true },
    transactionDetails: { type: transactionDetailsSchema },
    deliveryDate: { type: Date },
    profit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
