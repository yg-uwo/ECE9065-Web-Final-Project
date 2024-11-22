const CartService = require('../services/cart.service');
const OrderModel = require('../models/order.models');
const ProductModel = require('../models/product.models');
const PaymentService = require('../services/payment.service');

class OrderController {
    async checkout(req, res) {
        const { userId } = req.body;
        const paymentSuccess = PaymentService.simulatePayment();

        try {
            const cart = await CartService.getCart(userId);
            if (!cart) return res.status(404).json({message: 'Cart not found'});

            if (paymentSuccess) {
                for (const item of cart.items) {
                    await ProductModel.updateProductStock(item.productId, -item.quantity);
                }
                // Creating the order
                const order = await OrderModel.createOrder({
                    userId,
                    items: cart.items,
                    status: 'Confirmed',
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
}

module.exports = new OrderController();