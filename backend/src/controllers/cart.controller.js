const CartService = require('../services/cart.service');

class CartController {
    async createCart(req, res) {
        const { userId, items } = req.body;
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({message: 'Invalid data. Check the inputs(userId, item array)'});
        }
        try {
            const newCart = await CartService.createCart({ userId, items });
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ message: 'Error creating cart', error});
        }
    }

    async getCart(req, res) {
        const { userId } = req.params;
        try {
            const cart = await CartService.getCart(userId);
            if (!cart) return res.status(404).json({ message: 'Cart not found' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({message: 'Error fetching cart', error});
        }
    }

    async addToCart(req, res) {
        // Get userId from session/auth middleware
        const userId = req.user.id; // Assuming you have auth middleware that adds user to req
        const { productId, quantity = 1 } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                message: 'ProductId is required'
            });
        }

        try {
            // First try to get existing cart
            let cart = await CartService.getCart(userId);
            
            if (!cart) {
                // If no cart exists, create one
                cart = await CartService.createCart({
                    userId,
                    items: [{ productId, quantity }]
                });
            } else {
                // If cart exists, add/update item
                cart = await CartService.addItemToCart(userId, productId, quantity);
            }

            res.status(200).json({
                message: 'Item added to cart successfully',
                cart
            });
        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).json({
                message: 'Error adding item to cart',
                error: error.message
            });
        }
    }

    async removeFromCart(req, res) {
        const userId = req.user.id;
        const { productId } = req.params;

        try {
            const cart = await CartService.removeItemFromCart(userId, productId);
            res.status(200).json({
                message: 'Item removed from cart successfully',
                cart
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error removing item from cart',
                error: error.message
            });
        }
    }

    async updateCartItem(req, res) {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: 'ProductId and quantity are required'
            });
        }

        try {
            const cart = await CartService.updateItemQuantity(userId, productId, quantity);
            res.status(200).json({
                message: 'Cart item updated successfully',
                cart
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating cart item',
                error: error.message
            });
        }
    }

    async clearCart(req, res) {
        const userId = req.user.id;

        try {
            await CartService.clearCart(userId);
            res.status(200).json({
                message: 'Cart cleared successfully'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error clearing cart',
                error: error.message
            });
        }
    }
}

module.exports = new CartController();