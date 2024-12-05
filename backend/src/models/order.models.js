const mongoose = require('mongoose');

class OrderModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: { type: String, required: true },
            email: { type: String, required: true },
            items: [
                {
                    _id: false,
                    productId: { type: String, required: true },
                    quantity: { type: Number, required: true },
                },
            ],
            status: { type: String, default: 'Pending' },
            
        },{ timestamps: true });
        this.model = mongoose.model('orders', schema);

    }

    async createOrder(data) {
        const order = new this.model(data);
        return order.save();
    }

    async getAllOrders() {
        const result = await this.model.find({}, { updatedAt: 1, userId: 1, items: 1, status: 1 });
        return result;
    }
}

module.exports = new OrderModel();