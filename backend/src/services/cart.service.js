const CartModel = require('../models/cart.models');

class CartService {
    async getCart(userId) {
        return await CartModel.findCartByUser(userId);
    }
    async createCart(data) {
        return CartModel.createCart(data);
    }
    async deleteCart(cartId) {
        return CartModel.deleteCart(cartId);
    }
    async updateCartItem(userId, productId, quantity) {
        return CartModel.updateCartItem(userId, productId, quantity);
    }
}

module.exports = new CartService();