import mongoose from 'mongoose';

// Each variant = one color; quantity, sku, and images are per variant (e.g. different images per color).
const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true, sparse: true },
    images: [{ type: String, trim: true }],
  },
  { _id: true }
);

const pricingSchema = new mongoose.Schema(
  {
    buyingPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    product: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    stone: { type: String, trim: true },
    gender: { type: String, trim: true, enum: ['Men', 'Women', 'Unisex'] },
    pricing: { type: pricingSchema, required: true },
    variants: [variantSchema],
    thumbnails: [{ type: String, trim: true }],
    totalStock: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'draft'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

// productId already has unique: true (creates index).
productSchema.index({ product: 1, category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ stone: 1 });
productSchema.index({ gender: 1 });

productSchema.pre('save', function () {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
