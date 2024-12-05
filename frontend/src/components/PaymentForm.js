import React from "react";

const PaymentForm = ({ paymentDetails, validationErrors, onInputChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onInputChange(name, value);
    };

    return (
        <div className="payment-section">
            <h3>Payment Details</h3>
            <form className="payment-form">
                <label>
                    Card Number
                    <input
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                    />
                    {validationErrors.cardNumber && (
                        <span className="error">{validationErrors.cardNumber}</span>
                    )}
                </label>
                <label>
                    Expiry Date
                    <input
                        type="text"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                    />
                    {validationErrors.expiryDate && (
                        <span className="error">{validationErrors.expiryDate}</span>
                    )}
                </label>
                <label>
                    CVV
                    <input
                        type="password"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                    />
                    {validationErrors.cvv && (
                        <span className="error">{validationErrors.cvv}</span>
                    )}
                </label>
            </form>
        </div>
    );
};

export default PaymentForm;
