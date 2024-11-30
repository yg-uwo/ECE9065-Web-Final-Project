class PaymentService {
    simulatePayment() {
        return true;
        // return Math.random() > 0.5;
    }
}

module.exports = new PaymentService();