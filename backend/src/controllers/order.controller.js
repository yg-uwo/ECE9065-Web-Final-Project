const CartService = require('../services/cart.service');
const OrderModel = require('../models/order.models');
const ProductModel = require('../models/product.models');
const UserModel = require('../models/user.model');
const nodemailer = require('nodemailer');

class OrderController {
    async checkout(req, res) {
        const { userId, email } = req.body;
        let paymentSuccess = false;
        try {
            const cart = await CartService.getCart(userId);
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' })
            } else {
                paymentSuccess = true;
            }
            if (paymentSuccess) {
                for (const item of cart.items) {
                    try {
                        const updatedStock = await ProductModel.updateProductStock(item.productId, -item.quantity);
                        console.log("Updated stock data", updatedStock);
                        const quantityIsLessThenThreshold = updatedStock.quantity < 0;
                        if (!updatedStock || quantityIsLessThenThreshold) {
                            throw Error(res.status(500).json({ message: 'Error updating product stock' }));
                        }
                    } catch (err) {
                        console.log("Error is:", err);
                    }
                }
                // Creating the order
                const order = await OrderModel.createOrder({
                    userId,
                    email,
                    items: cart.items,
                    status: 'Confirmed',
                    totalAmount: this.calculateTotalAmount(cart.items),
                    paymentStatus: paymentSuccess ? 'Success' : 'Failed',
                })
                // Send Email here with order details
                const userEmail = email;
                if (userEmail) {
                    await this.sendOrderConfirmationEmail(userEmail, order);
                }
                await CartService.deleteCart(cart._id);

                res.json({ message: 'Order confirmed', order });
            } else {
                res.json({ message: 'Payment failed. No updates made.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error during checkout', error });
        }
    }

    calculateTotalAmount(items) {
        return items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    }

    async listOrders(req, res) {
        try {
            const { first_name } = req.query;

            let userFilter = {};
            if (first_name) {
                userFilter.first_name = new RegExp(first_name, "i");
            }

            const orders = await OrderModel.getAllOrders();
            const users = await UserModel.find(userFilter);
            const userMap = new Map(users.map(user => [user._id.toString(), user]));
            const products = await ProductModel.getAllProducts();
            const productMap = new Map(products.map(product => [product.productId, product.title]));

            // console.log(orders);

            const final_list = orders.map(order => {
                const user = userMap.get(order.userId);
                const items = order.items.map(item => ({
                    productName: productMap.get(item.productId) || "Unknown",
                    quantity: item.quantity,
                }));


                return user ? {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    status: order.status,
                    updatedAt:order.updatedAt,
                    items,
                } : null;
            }).filter(Boolean);

            res.json(final_list);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch orders." });
        }
    }

    async sendOrderConfirmationEmail(toEmail, order) {
        try {
            // Configure the transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: toEmail,
                subject: 'Order Confirmation',
                html: `
                    <h1>Order Confirmation</h1>
                    <p>Thank you for your purchase! Your order has been confirmed.</p>
                    <h3>Order Details</h3>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                <strong>Product:</strong> ${item.productId.name} <br />
                                <strong>Quantity:</strong> ${item.quantity} <br />
                                <strong>Price:</strong> $${item.productId.price}
                            </li>
                        `).join('')}
                    </ul>
                    <h3>Total Amount: $${order.totalAmount}</h3>
                    <p>Status: ${order.status}</p>
                `,
            };

            // Send the email
            await transporter.sendMail(mailOptions);
            console.log('Order confirmation email sent successfully.');
        } catch (error) {
            console.error('Error sending order confirmation email:', error);
        }
    }
}

module.exports = new OrderController();