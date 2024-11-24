const mongoose = require('mongoose');

class ProductModel {
  constructor() {
    const schema = new mongoose.Schema(
      {
        productId: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        screen: { type: String },
        images: { type: [String], default: [] },
        specification: {
          operating_system: { type: String },
          standard_memory: { type: String },
          battery_life: { type: String },
          cpu_model: { type: String },
        },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        manufacturer: { type: String },
        popularity: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      { 
        collection: 'productInfo',
        timestamps: true 
      }
    );

    this.model = mongoose.model('productInfo', schema);
  }

  getModel() {
    return this.model;
  }

  async updateProductStock(productId, quantity) {
    return this.model.findByIdAndUpdate(productId, { $inc: { quantity } });
  }
}

module.exports = new ProductModel().getModel();

