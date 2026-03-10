import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNum) || 1;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
    const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};
    const filter = { ...keyword, ...category, ...minPrice, ...maxPrice };

    let sort = {};
    if (req.query.sort === 'price_asc') sort = { price: 1 };
    else if (req.query.sort === 'price_desc') sort = { price: -1 };
    else sort = { createdAt: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: req.body.name || 'Sample Product',
        price: req.body.price || 0,
        user: req.user._id,
        images: req.body.images || ['/images/placeholder.jpg'],
        brand: req.body.brand || 'Sample Brand',
        category: req.body.category || 'Casual',
        countInStock: req.body.countInStock || 0,
        numReviews: 0,
        description: req.body.description || 'Sample description',
        sizes: req.body.sizes || [],
        colors: req.body.colors || [],
        isNew: req.body.isNew || false,
        isFeatured: req.body.isFeatured || false,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, images, brand, category, countInStock, sizes, colors, isNew, isFeatured } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name ?? product.name;
        product.price = price ?? product.price;
        product.description = description ?? product.description;
        product.images = images ?? product.images;
        product.brand = brand ?? product.brand;
        product.category = category ?? product.category;
        product.countInStock = countInStock ?? product.countInStock;
        product.sizes = sizes ?? product.sizes;
        product.colors = colors ?? product.colors;
        product.isNew = isNew ?? product.isNew;
        product.isFeatured = isFeatured ?? product.isFeatured;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
