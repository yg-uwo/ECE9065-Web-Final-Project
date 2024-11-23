import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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
}

export default ApiService;