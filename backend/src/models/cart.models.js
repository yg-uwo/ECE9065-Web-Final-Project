const mongoose = require('mongoose');

class CartModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: { type: String, required: true},
            items: [
                {
                    _id: false,
                    productId: {type: String, required: true},
                    quantity: {type: Number, required: true},
                }
            ],
        });
        this.model = mongoose.model('carts', schema);
    }

    async findCartByUser(userId) {
        try {
            const cart = await this.model.findOne({ _id: userId});
            console.log("Cart info:", cart);
            if (!cart || cart === null) { 
                throw new Error(`Cart for userId ${userId} not found`);
            }
            return cart;
        } catch (error) {
            throw new Error(`Error in finding the cart`);
        }
    }

    async createCart(data) {
        try {
            const existingCart = await this.model.findOne({ userId: data.userId });
            // Merging new items into exisiting cart
            if (existingCart) {
                existingCart.items.push(...data.items);
                await existingCart.save();
                return existingCart;
            }
            const cart = new this.model(data);
            const savedCart = await cart.save();
            return savedCart.save();
        } catch (error) {
            throw new Error('Error in creating cart');
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await this.model.findByIdAndDelete(cartId);
            if (!deletedCart) {
                throw new Error('Cart not found');
            }
            return deletedCart;
        } catch (error) {
            throw new Error('Error deleting cart');
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            const cart = await this.model.findOne({userId});
            if (!cart) {
                throw new Error(`Cart for userId ${userId} not found`);
            }
            const itemIndex = cart.items.findIndex(item => item.productId === productId);
            if (itemIndex === -1) {
                throw new Error(`Product with productId ${productId} not found in cart`);
            }
            cart.items[itemIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw new Error('Error updating the cart item');
        }
    }
}

module.exports = new CartModel();