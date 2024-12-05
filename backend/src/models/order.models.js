const mongoose = require('mongoose');

class OrderModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: {type: String, required: true},
            email: { type: String, required: true },
            items: [
                {
                    _id: false,
                    productId: { type: String, required: true},
                    quantity: {type: Number, required: true},
                },
            ],
            status: {type: String, default: 'Pending'},
        });
        this.model = mongoose.model('orders', schema);
    }

    async createOrder(data) {
        const order = new this.model(data);
        return order.save();
    }
}

module.exports = new OrderModel();