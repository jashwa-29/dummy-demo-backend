const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Create a new product
exports.addProduct = async (req, res) => {
  try {
    const { productName, price, category, productInfo, detailedInfo, role, weight } = req.body;

    // Ensure weight is an array
    const weights = Array.isArray(weight) ? weight : [weight]; // If weight is not an array, convert it to an array

    // Handle main image and sub images
    const mainImage = req.files['mainImage'] ? req.files['mainImage'][0].filename : null;
    const subImages = req.files['subImages'] ? req.files['subImages'].map(file => file.filename) : [];

    const newProduct = new Product({
      productName,
      role,
      price,
      category,
      productInfo,
      detailedInfo,
      weight: weights,  // Store weight as an array
      mainImage,
      subImages
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });

  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Extract all categories from the products
    const categories = products.map(product => product.category);

    res.status(200).json({ categories });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

    

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, price, category, productInfo, detailedInfo, weight } = req.body;

  // Ensure weight is an array
  const weights = Array.isArray(weight) ? weight : [weight]; // If weight is not an array, convert it to an array

  try {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle images
    let mainImage = existingProduct.mainImage;
    if (req.files['mainImage']) {
      if (mainImage) {
        const oldMainPath = path.join(__dirname, '../uploads', mainImage);
        fs.unlink(oldMainPath, (err) => {
          if (err) console.error('Error deleting old main image:', err);
        });
      }
      mainImage = req.files['mainImage'][0].filename;
    }

    let subImages = existingProduct.subImages;
    if (req.files['subImages']) {
      if (subImages.length > 0) {
        subImages.forEach(image => {
          const oldSubPath = path.join(__dirname, '../uploads', image);
          fs.unlink(oldSubPath, (err) => {
            if (err) console.error('Error deleting old sub image:', err);
          });
        });
      }
      subImages = req.files['subImages'].map(file => file.filename);
    }

    // Safely update only allowed fields (including weight as an array)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        price,
        category,
        productInfo,
        detailedInfo,
        weight: weights,  // Updating weight as an array
        mainImage,
        subImages,
      },
      { new: true }
    );

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete main image if exists
    if (deletedProduct.mainImage) {
      const mainImagePath = path.join(__dirname, '../uploads', deletedProduct.mainImage);
      fs.unlink(mainImagePath, (err) => {
        if (err) console.error('Error deleting main image:', err);
      });
    }

    // Delete sub-images if they exist
    if (deletedProduct.subImages && deletedProduct.subImages.length > 0) {
      deletedProduct.subImages.forEach((subImage) => {
        const subImagePath = path.join(__dirname, '../uploads', subImage);
        fs.unlink(subImagePath, (err) => {
          if (err) console.error('Error deleting sub-image:', err);
        });
      });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
