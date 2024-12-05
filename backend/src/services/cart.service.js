const CartModel = require('../models/cart.models');

class CartService {
    async getCart(userId) {
        return CartModel.findCartByUser(userId);
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
    async clearCartByUserId(userId) {
        return CartModel.clearCartByUserId(userId);
    }
}

module.exports = new CartService();