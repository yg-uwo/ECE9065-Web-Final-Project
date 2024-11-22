const mongoose = require('mongoose');

class ProductModel {
  constructor() {
    const schema = new mongoose.Schema({
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    });

    this.model = mongoose.model('Product', schema, 'productInfo');
  }

  async updateProductStock(productId, quantity) {
    return this.model.findByIdAndUpdate(productId, { $inc: { quantity } });
  }
}

module.exports = new ProductModel();
