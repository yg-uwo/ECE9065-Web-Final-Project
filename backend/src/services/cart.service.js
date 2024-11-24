const CartModel = require('../models/cart.models');

class CartService {
    async getCart(userId) {
        return CartModel.findCartByUser(userId);
    }
    async createCart(data) {
        console.log("Hello")
        return CartModel.createCart(data);
    }
    async deleteCart(cartId) {
        return CartModel.deleteCart(cartId);
    }
}

module.exports = new CartService();