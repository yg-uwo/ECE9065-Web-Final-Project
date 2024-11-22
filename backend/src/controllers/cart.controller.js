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
}

module.exports = new CartController();