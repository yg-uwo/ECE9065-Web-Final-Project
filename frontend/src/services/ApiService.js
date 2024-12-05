import axios from "axios";

const API_BASE_URL = "https://jot-web-final-img-205543273236.us-central1.run.app/api";

class ApiService {
    static async getCart(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to fetch cart");
        }
    }

    static async checkout(cartData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/checkout`, cartData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Checkout failed");
        }
    }

    static async updateCart(userId, cartData) {
        try {
            console.log("Inside Cart", cartData);
            const response = await axios.put(`${API_BASE_URL}/cart/update/${userId}`, cartData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to update cart");
        }
    }

    static async clearCart(userId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/cart/clear/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Failed to clear cart");
        }
    }

}

export default ApiService;