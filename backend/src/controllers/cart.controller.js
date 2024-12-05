const CartService = require('../services/cart.service');

class CartController {
    async createCart(req, res) {
        const { userId, items,email } = req.body;
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({message: 'Invalid data. Check the inputs(userId, item array)'});
        }
        try {
            const newCart = await CartService.createCart({ userId, items,email });
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ message: 'Error creating cart', error});
        }
    }

    async getCart(req, res) {
        let { userId } = req.params;
        try {
            const cart = await CartService.getCart(userId);
            if (!cart || cart === null) {
                return res.status(404).json({ message: 'Cart not found' })
            };
            res.json(cart);
        } catch (error) {
            res.status(500).json({message: 'Error fetching cart', error});
        }
    }

    async updateCart(req, res) {
        const { items } = req.body;
        const { userId } = req.params;
        console.log("Items count", items);
        // Validate the request body
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid data. Ensure userId and items (as an array) are provided.' });
        }
    
        try {
            const updatedItems = [];
            // in this case we need to clear the cart
            if (items.length === 0) {
                await CartService.clearCartByUserId(userId);
            }
    
            // Iterate through items sequentially
            for (const item of items) {
                // Validate individual item structure
                if (!item.productId || typeof item.quantity !== 'number') {
                    return res.status(400).json({ 
                        message: `Invalid item data for productId: ${item.productId}` 
                    });
                }
    
                try {
                    // Ensure userId is a string
                    const userIdString = userId.toString();
    
                    // Update each item in the cart one by one
                    const updatedItem = await CartService.updateCartItem(
                        userIdString, 
                        item.productId, 
                        item.quantity
                    );
    
                    updatedItems.push(updatedItem);
                } catch (itemUpdateError) {
                    console.error(`Error updating item ${item.productId}:`, itemUpdateError);
                    
                    // Optionally, you can choose to stop the entire process if one item fails
                    return res.status(500).json({ 
                        message: 'Error updating cart item', 
                        error: itemUpdateError.message,
                        productId: item.productId 
                    });
                }
            }
    
            // Respond with the successfully updated cart items
            return res.status(200).json({ 
                message: 'Cart updated successfully.', 
                updatedItems,
                partialSuccess: updatedItems.length < items.length 
            });
        } catch (error) {
            console.error('Error updating cart:', error);
            return res.status(500).json({ 
                message: 'Unexpected error updating cart', 
                error: error.message 
            });
        }
    }
    
    async clearCart(req, res) {
        const { userId } = req.body;
        // Validate the request body
        if (!userId) {
            return res.status(400).json({ message: 'Invalid data. userId is required.' });
        }
        try {
            // Call the service layer to clear the cart
            const result = await CartService.clearCartByUserId(userId);
            // Respond based on the result
            if (result) {
                return res.status(200).json({ message: 'Cart cleared successfully.' });
            } else {
                return res.status(404).json({ message: 'Cart not found for the specified user.' });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            return res.status(500).json({ message: 'Error clearing cart', error: error.message });
        }
    }
}

module.exports = new CartController();
