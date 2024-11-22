const mongoose = require('mongoose');

class CartModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: { type: String, required: true},
            items: [
                {
                    productId: {type: String, required: true},
                    quantity: {type: Number, required: true},
                }
            ],
        });
        this.model = mongoose.model('Cart', schema, 'carts');
    }

    async findCartByUser(userId) {
        return this.model.findOne({userId}).populate('items.productId');
    }

    async createCart(data) {
        const cart = new this.model(data);
        return cart.save();
    }

    async deleteCart(cartId) {
        return this.model.findByIdAndDelete(cartId);
    }
}

module.exports = new CartModel();