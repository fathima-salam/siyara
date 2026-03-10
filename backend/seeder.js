import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();
connectDB();

const users = [
    { name: 'Admin User', email: 'admin@siyara.com', password: 'admin123', isAdmin: true },
    { name: 'John Doe', email: 'john@example.com', password: 'user123', isAdmin: false },
    { name: 'Jane Doe', email: 'jane@example.com', password: 'user123', isAdmin: false },
];

const products = [
    {
        name: 'Bohemian Rhapsody Attire',
        images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'],
        brand: 'Siyara',
        category: 'Women',
        description: 'Effortlessly blend comfort and style with this stunning bohemian-inspired dress collection.',
        price: 89.99,
        countInStock: 25,
        rating: 4.5,
        numReviews: 12,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Floral Blue', 'Earth Brown', 'Sage Green'],
        isNew: true,
        isFeatured: true,
    },
    {
        name: 'Midnight Gala Maxi Dress',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'],
        brand: 'Siyara',
        category: 'Formal',
        description: 'Turn heads at any gala or formal event with this luxurious floor-length maxi dress.',
        price: 129.99,
        countInStock: 15,
        rating: 4.8,
        numReviews: 20,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Midnight Black', 'Deep Navy', 'Burgundy'],
        isNew: false,
        isFeatured: true,
    },
    {
        name: 'Power Suit Ensemble',
        images: ['https://images.unsplash.com/photo-1594938298603-a8ffa4caeda6?w=800'],
        brand: 'Siyara',
        category: 'Formal',
        description: 'Exude confidence and authority in our tailored power suit collection, designed for modern professionals.',
        price: 199.99,
        countInStock: 10,
        rating: 4.7,
        numReviews: 9,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Charcoal', 'Navy Blue', 'Ivory'],
        isNew: false,
        isFeatured: true,
    },
    {
        name: 'Professional Pinstripe Blazer',
        images: ['https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800'],
        brand: 'Siyara',
        category: 'Formal',
        description: 'Classic professional pinstripe blazers collection for the modern workplace.',
        price: 149.99,
        countInStock: 20,
        rating: 4.6,
        numReviews: 15,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Classic Black', 'Dark Grey', 'Navy'],
        isNew: true,
        isFeatured: true,
    },
    {
        name: 'Relaxed Fit Joggers',
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800'],
        brand: 'Siyara',
        category: 'Casual',
        description: 'Ultra-comfortable relaxed fit joggers for everyday wear and leisure activities.',
        price: 49.99,
        countInStock: 50,
        rating: 4.3,
        numReviews: 25,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Grey Melange', 'Black', 'Heather Blue'],
        isNew: true,
        isFeatured: false,
    },
    {
        name: 'Urban Chic Ensemble',
        images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'],
        brand: 'Siyara',
        category: 'Casual',
        description: 'Discover the allure of fashion reinvented with our urban chic collection.',
        price: 79.99,
        countInStock: 30,
        rating: 4.4,
        numReviews: 18,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Urban Grey', 'Camel', 'Off-White'],
        isNew: false,
        isFeatured: true,
    },
    {
        name: 'Timeless Classic Trench',
        images: ['https://images.unsplash.com/photo-1548544149-4835e62ee5b3?w=800'],
        brand: 'Siyara',
        category: 'Jackets',
        description: 'A wardrobe staple. This timeless classic trench coat elevates any outfit.',
        price: 179.99,
        countInStock: 12,
        rating: 4.9,
        numReviews: 32,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Camel', 'Khaki', 'Black'],
        isNew: false,
        isFeatured: true,
    },
    {
        name: 'Weekend Wanderlust Wardrobe Set',
        images: ['https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800'],
        brand: 'Siyara',
        category: 'Casual',
        description: 'The complete weekend wardrobe set for your adventures — stylish and practical.',
        price: 119.99,
        countInStock: 20,
        rating: 4.5,
        numReviews: 11,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Pastel Pink', 'Light Blue', 'Mint'],
        isNew: true,
        isFeatured: false,
    },
    {
        name: 'Exquisite Leather Bag',
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
        brand: 'Siyara',
        category: 'Bags',
        description: 'Explore our exquisite bag collection — handcrafted leather bags that complement any outfit.',
        price: 219.99,
        countInStock: 8,
        rating: 4.9,
        numReviews: 40,
        sizes: ['One Size'],
        colors: ['Cognac', 'Black', 'Tan'],
        isNew: false,
        isFeatured: true,
    },
    {
        name: 'Casual Denim Jacket',
        images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800'],
        brand: 'Siyara',
        category: 'Jackets',
        description: 'The quintessential casual denim jacket — a forever-classic piece for any wardrobe.',
        price: 89.99,
        countInStock: 35,
        rating: 4.4,
        numReviews: 22,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Classic Blue', 'Dark Wash', 'Light Wash'],
        isNew: false,
        isFeatured: false,
    },
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        const sampleProducts = products.map((p) => ({ ...p, user: adminUser }));
        await Product.insertMany(sampleProducts);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
