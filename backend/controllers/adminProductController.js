import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

const PRODUCT_STATUSES = ['active', 'out_of_stock', 'draft'];
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (admin)
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

/**
 * @route   GET /api/admin/products/:id
 * @desc    Get product by ID (admin)
 */
export const getProductById = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

/**
 * @route   POST /api/admin/products
 * @desc    Add product (admin)
 */
export const addProduct = asyncHandler(async (req, res) => {
  const {
    productId,
    product,
    productName,
    category,
    brand,
    description,
    pricing,
    variants,
    thumbnails,
    status,
  } = req.body;

  if (!productId || !product || !productName || !category || !brand || !pricing) {
    res.status(400);
    throw new Error('Missing required fields: productId, product, productName, category, brand, pricing');
  }
  if (typeof pricing.buyingPrice !== 'number' || typeof pricing.sellingPrice !== 'number') {
    res.status(400);
    throw new Error('pricing.buyingPrice and pricing.sellingPrice are required numbers');
  }
  const statusVal = status && PRODUCT_STATUSES.includes(status) ? status : 'draft';
  const normalizedVariants = (variants || []).map((v) => ({
    color: String(v.color || '').trim(),
    quantity: Math.max(0, Number(v.quantity) || 0),
    sku: v.sku != null ? String(v.sku).trim() : undefined,
    images: Array.isArray(v.images) ? v.images.map((url) => (url != null ? String(url).trim() : '')).filter(Boolean) : [],
  }));

  const productDoc = await Product.create({
    productId: String(productId).trim(),
    product: String(product).trim(),
    productName: String(productName).trim(),
    category: String(category).trim(),
    brand: String(brand).trim(),
    description: description != null ? String(description) : '',
    pricing: {
      buyingPrice: Math.max(0, Number(pricing.buyingPrice)),
      sellingPrice: Math.max(0, Number(pricing.sellingPrice)),
      offerPrice: pricing.offerPrice != null ? Math.max(0, Number(pricing.offerPrice)) : undefined,
    },
    variants: normalizedVariants,
    thumbnails: Array.isArray(thumbnails) ? thumbnails.filter(Boolean) : [],
    status: statusVal,
  });

  res.status(201).json(productDoc);
});

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Edit product (admin) – full update including variants and stock
 */
export const editProduct = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    productId,
    product: productGroup,
    productName,
    category,
    brand,
    description,
    pricing,
    variants,
    thumbnails,
    status,
  } = req.body;

  if (productId) product.productId = productId;
  if (productGroup) product.product = productGroup;
  if (productName) product.productName = productName;
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (description !== undefined) product.description = description;
  if (pricing) {
    if (pricing.buyingPrice !== undefined) product.pricing.buyingPrice = pricing.buyingPrice;
    if (pricing.sellingPrice !== undefined) product.pricing.sellingPrice = pricing.sellingPrice;
    if (pricing.offerPrice !== undefined) product.pricing.offerPrice = pricing.offerPrice;
  }
  if (Array.isArray(variants)) {
    product.variants = variants.map((v) => ({
      color: String(v.color || '').trim(),
      quantity: Math.max(0, Number(v.quantity) || 0),
      sku: v.sku != null ? String(v.sku).trim() : undefined,
      images: Array.isArray(v.images) ? v.images.map((url) => (url != null ? String(url).trim() : '')).filter(Boolean) : [],
    }));
  }
  if (Array.isArray(thumbnails)) product.thumbnails = thumbnails.filter(Boolean);
  if (status && PRODUCT_STATUSES.includes(status)) product.status = status;

  await product.save();
  res.json(product);
});

/**
 * @route   PATCH /api/admin/products/:id/pricing
 * @desc    Update product pricing only (admin) – uses schema: pricing.buyingPrice, sellingPrice, offerPrice
 */
export const updateProductPricing = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { buyingPrice, sellingPrice, offerPrice } = req.body;
  if (buyingPrice !== undefined) product.pricing.buyingPrice = Math.max(0, Number(buyingPrice));
  if (sellingPrice !== undefined) product.pricing.sellingPrice = Math.max(0, Number(sellingPrice));
  if (offerPrice !== undefined) product.pricing.offerPrice = Math.max(0, Number(offerPrice));

  await product.save();
  res.json(product);
});

/**
 * @route   PATCH /api/admin/products/:id/stock
 * @desc    Update stock quantity for a variant or whole product (admin)
 */
export const updateStock = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { variantIndex, color, quantity } = req.body;

  if (variantIndex !== undefined && Number.isInteger(variantIndex)) {
    if (variantIndex < 0 || variantIndex >= product.variants.length) {
      res.status(400);
      throw new Error('Invalid variant index');
    }
    product.variants[variantIndex].quantity = Math.max(0, Number(quantity));
  } else if (color) {
    const variant = product.variants.find((v) => v.color.toLowerCase() === color.toLowerCase());
    if (!variant) {
      res.status(400);
      throw new Error(`Variant with color "${color}" not found`);
    }
    variant.quantity = Math.max(0, Number(quantity));
  } else {
    res.status(400);
    throw new Error('Provide variantIndex or color and quantity');
  }

  await product.save();
  res.json(product);
});

/**
 * @route   PATCH /api/admin/products/:id/variant
 * @desc    Update one variant by color or variantIndex (admin). Body: variantIndex or matchColor to find; then color, quantity, sku, images to update.
 */
export const updateVariant = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { variantIndex, matchColor, color, quantity, sku, images } = req.body;

  let variant;
  if (variantIndex !== undefined && Number.isInteger(variantIndex)) {
    if (variantIndex < 0 || variantIndex >= product.variants.length) {
      res.status(400);
      throw new Error('Invalid variant index');
    }
    variant = product.variants[variantIndex];
  } else if (matchColor != null && String(matchColor).trim()) {
    variant = product.variants.find((v) => v.color && String(v.color).toLowerCase() === String(matchColor).trim().toLowerCase());
    if (!variant) {
      res.status(404);
      throw new Error(`Variant with color "${matchColor}" not found`);
    }
  } else {
    res.status(400);
    throw new Error('Provide variantIndex or matchColor to identify the variant');
  }

  if (color !== undefined) variant.color = String(color || '').trim();
  if (quantity !== undefined) variant.quantity = Math.max(0, Number(quantity));
  if (sku !== undefined) variant.sku = sku == null ? undefined : String(sku).trim();
  if (Array.isArray(images)) variant.images = images.map((url) => (url != null ? String(url).trim() : '')).filter(Boolean);

  await product.save();
  res.json(product);
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product (admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
});

/**
 * @route   PATCH /api/admin/products/bulk-update
 * @desc    Bulk update products (pricing, status, variant qty & sku)
 */
export const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { products } = req.body || {};

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error('No products provided for bulk update');
  }

  let updatedCount = 0;

  for (const update of products) {
    const { productId, pricing, status, variants } = update || {};

    if (!productId) {
      res.status(400);
      throw new Error('Each bulk update item must include productId');
    }

    const product = await Product.findOne({ productId: String(productId).trim() });
    if (!product) {
      res.status(404);
      throw new Error(`Product with productId "${productId}" not found`);
    }

    // Update pricing
    if (pricing) {
      const { buyingPrice, sellingPrice, offerPrice } = pricing;
      if (buyingPrice !== undefined) {
        const val = Number(buyingPrice);
        if (Number.isNaN(val) || val < 0) {
          res.status(400);
          throw new Error(`Invalid buyingPrice for productId "${productId}"`);
        }
        product.pricing.buyingPrice = val;
      }
      if (sellingPrice !== undefined) {
        const val = Number(sellingPrice);
        if (Number.isNaN(val) || val < 0) {
          res.status(400);
          throw new Error(`Invalid sellingPrice for productId "${productId}"`);
        }
        product.pricing.sellingPrice = val;
      }
      if (offerPrice !== undefined) {
        const val = Number(offerPrice);
        if (Number.isNaN(val) || val < 0) {
          res.status(400);
          throw new Error(`Invalid offerPrice for productId "${productId}"`);
        }
        product.pricing.offerPrice = val;
      }
    }

    // Update status
    if (status !== undefined) {
      if (!PRODUCT_STATUSES.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status "${status}" for productId "${productId}"`);
      }
      product.status = status;
    }

    // Update variants (by color)
    if (Array.isArray(variants)) {
      for (const v of variants) {
        const { color, quantity, sku } = v || {};
        if (!color) {
          res.status(400);
          throw new Error(`Variant color is required for productId "${productId}"`);
        }
        const variant = product.variants.find(
          (vv) => vv.color && String(vv.color).toLowerCase() === String(color).trim().toLowerCase()
        );
        if (!variant) {
          res.status(400);
          throw new Error(`Variant with color "${color}" not found for productId "${productId}"`);
        }
        if (quantity !== undefined) {
          const q = Number(quantity);
          if (Number.isNaN(q) || q < 0) {
            res.status(400);
            throw new Error(`Invalid quantity for color "${color}" on productId "${productId}"`);
          }
          variant.quantity = q;
        }
        if (sku !== undefined) {
          variant.sku = sku == null ? undefined : String(sku).trim();
        }
      }
    }

    await product.save(); // pre-save hook keeps totalStock in sync
    updatedCount += 1;
  }

  res.json({ message: 'Bulk update successful', updatedCount });
});
