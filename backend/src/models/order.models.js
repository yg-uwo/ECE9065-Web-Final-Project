const mongoose = require('mongoose');

class OrderModel {
    constructor() {
        const schema = new mongoose.Schema({
            userId: {type: String, required: true},
            items: [
                {
                    productId: { type: String, required: true, ref: 'Product' },
                    quantity: {type: Number, required: true},
                },
            ],
            status: {type: String, default: 'Pending'},
        });
        this.model = mongoose.model('Order', schema, 'orders');
    }

    async createOrder(data) {
        const order = new this.model(data);
        return order.save();
    }
}

module.exports = new OrderModel();