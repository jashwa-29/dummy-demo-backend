const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Assuming you have Product model

// Add product to cart
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, weight } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const qty = parseInt(quantity) || 1;

  try {
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        const existingItem = cart.items[itemIndex];
        existingItem.quantity = (existingItem.quantity || 0) + qty;
        if (weight) {
          existingItem.weight = weight; // optional: update weight if it's sent
        }
      }

      await cart.save();
      return res.json(cart);
    } else {
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity: qty, weight }],
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out items with null productId (in case the product was deleted)
    cart.items = cart.items.filter(item => item.productId !== null);

    // Optionally, you can also recalculate the total price of items here if you want
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const userId = req.user.id; // ⬅️ Get from JWT middleware
    const { productId } = req.body;
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      await cart.save();
  
      res.json({ message: 'Item removed', cart });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Clear entire cart
// Clear cart
 // Ensure Cart model is correctly imported

 // Edit quantity and weight of item in cart
 exports.editItemInCart = async (req, res) => {
  const userId = req.params.userId; // Declare userId properly
  const { productId, quantity, weight } = req.body; // Assuming quantity and weight are provided in the request body

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // If product is found in the cart, update quantity and weight
      if (quantity) {
        cart.items[itemIndex].quantity = quantity;
      }
      if (weight) {
        cart.items[itemIndex].weight = weight;
      }

      // Save the updated cart
      await cart.save();
      return res.json({ message: 'Item updated successfully', cart });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.clearCart = async (req, res) => {
  try {
    // Find the cart for the user and delete it
    const result = await Cart.findOneAndDelete({ userId: req.user.id });

    // If no cart was found for the user
    if (!result) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while clearing the cart' });
  }
};
