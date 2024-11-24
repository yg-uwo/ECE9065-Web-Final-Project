class PaymentService {
    simulatePayment() {
        return Math.random() > 0.5;
    }
}

module.exports = new PaymentService();