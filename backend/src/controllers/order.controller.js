const CartService = require('../services/cart.service');
const OrderModel = require('../models/order.models');
const ProductModel = require('../models/product.models');
const PaymentService = require('../services/payment.service');

class OrderController {
    async checkout(req, res) {
        let { userId } = req.body;
        // userId = '674a237650bd21327aece0ee';
        const paymentSuccess = PaymentService.simulatePayment();
        try {
            const cart = await CartService.getCart(userId);
            if (!cart) return res.status(404).json({message: 'Cart not found'});

            if (paymentSuccess) {
                for (const item of cart.items) {
                    console.log("Inside payments");
                    try {
                        await ProductModel.updateProductStock(item.productId, -item.quantity);
                        if (!updatedStock) {
                            return res.status(500).json({ message: 'Error updating product stock' });
                        }
                    } catch (err) {
                        console.log("Error is:", err);
                    }
                }
                // Creating the order
                const order = await OrderModel.createOrder({
                    userId,
                    items: cart.items,
                    status: 'Confirmed',
                    totalAmount: this.calculateTotalAmount(cart.items),
                    paymentStatus: paymentSuccess ? 'Success' : 'Failed',
                })

                await CartService.deleteCart(cart._id);

                res.json({ message: 'Order confirmed', order });
            } else {
                res.json({ message: 'Payment failed. No updates made.' });
            }
        } catch(error) {
            res.status(500).json({ message: 'Error during checkout', error });
        }
    }
    calculateTotalAmount(items) {
        return items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    }
}

module.exports = new OrderController();