const mongoose = require('mongoose');

class CartModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: { type: String, required: true},
            items: [
                {
                    _id: false,
                    productId: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    imageUrl: { type: String, required: true },
                    productName: { type: String, required: true },
                    price: { type: Number, required: true },
                }
            ],
        }, { timestamps: true });
        this.model = mongoose.model('carts', schema);
    }

    async findCartByUser(id) {
        try {
            const cartInfo = await this.model.findOne({ userId: id});
            if (!cartInfo || cartInfo === null) { 
                return cartInfo;
            }
            return cartInfo;
        } catch (error) {
            throw new Error(`Error in finding the cart`, error);
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
            throw new Error('Error in creating cart', error);
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
        // Ensure inputs are converted to appropriate types
        const userIdString = userId.toString();
        const productIdString = productId.toString();
        console.log("Inside UserId", userId);
        // Input validation
        if (!userIdString || !productIdString || quantity === undefined || quantity === null) {
            throw new Error('Invalid input: userId, productId, and quantity are required');
        }
    
        try {
            console.log("Updated UserId:", { userId: userIdString, productId: productIdString, quantity });
            
            const cart = await this.model.findOne({ userId: userIdString });
            if (!cart) {
                throw new Error(`Cart for userId ${userIdString} not found`);
            }
    
            const itemIndex = cart.items.findIndex(item => item.productId === productIdString);
            if (itemIndex === -1) {
                throw new Error(`Product with productId ${productIdString} not found in cart`);
            }
    
            cart.items[itemIndex].quantity = quantity;
       
            // Save the updated cart
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.error(`Error in updateCartItem: ${error.message}`);
            throw new Error(`Error updating the cart item: ${error.message}`);
        }
    }
   

    async clearCartByUserId(userId) {
        if (!userId) {
            throw new Error('userId is required');
        }
        const result = await this.model.findOneAndUpdate(
            { userId }, 
            { $set: { items: [] } }, 
            { new: true } 
        );
    
        return result; // Return the result for further use
    }
}

module.exports = new CartModel();