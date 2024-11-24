const Product = require('../models/product.models');
const { ERROR_MESSAGES } = require('../utils/constants');

class ProductService {
  async createProduct(data) {
    if (!data.productId || !data.category) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }
    const product = new Product(data);
    return product.save();
  }

  async getProductById(productId) {
    const product = await Product.findOne({ productId });
    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async updateProduct(productId, updates) {
    const product = await Product.findOneAndUpdate({ productId }, updates, { new: true });
    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findOneAndDelete({ productId });
    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

//   async updateProductStock(productId, quantity) {
//     const product = await Product.findOneAndUpdate(
//       { productId },
//       { $inc: { quantity } },
//       { new: true }
//     );
//     if (!product) {
//       throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
//     }
//     return product;
//   }
}

module.exports = new ProductService();
