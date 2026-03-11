import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';

// @route   GET /api/admin/categories
// @desc    Get all categories with subcategories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
});

// @route   POST /api/admin/categories
// @desc    Create category (no subcategories)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, isActive } = req.body;
  if (!name || !slug) {
    res.status(400);
    throw new Error('Category name and slug are required');
  }
  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) {
    res.status(400);
    throw new Error('Category with this name or slug already exists');
  }
  const cat = await Category.create({
    name: name.trim(),
    slug: slug.trim(),
    description: description || '',
    isActive: isActive !== undefined ? !!isActive : true,
  });
  res.status(201).json(cat);
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category (no subcategories)
export const updateCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) {
    res.status(404);
    throw new Error('Category not found');
  }
  const { name, slug, description, isActive } = req.body;
  if (name) cat.name = name.trim();
  if (slug) cat.slug = slug.trim();
  if (description !== undefined) cat.description = description;
  if (isActive !== undefined) cat.isActive = !!isActive;
  const updated = await cat.save();
  res.json(updated);
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
export const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) {
    res.status(404);
    throw new Error('Category not found');
  }
  await cat.deleteOne();
  res.json({ message: 'Category removed' });
});

