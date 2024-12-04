const mongoose = require('mongoose');

class ProductModel {
  constructor() {
    const schema = new mongoose.Schema(
      {
        productId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        screen: { type: String },
        images: { type: [String], default: [] },
        specification: {
          operating_system: { type: String },
          standard_memory: { type: String },
          battery_life: { type: String },
          cpu_model: { type: String },
        },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        manufacturer: { type: String },
        popularity: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        reviews: [{
          title: { type: String },
          rating: { type: Number },
          text: { type: String },
          positive_feedback: { type: Number },
          negative_feedback: { type: Number },
          review_submission_time: { type: String },
          user_nickname: { type: String }
        }],
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

  async updateProductStock(id, quantity) {
    try {
        const result = await this.model.findOneAndUpdate(
            { productId: id },
            { $inc: { quantity } },
            { new: true }
        );
        return result;
    } catch (err) {
        console.log("Error in payments", err);
        throw err; // Throw the error to be handled by the caller
    }
  }
}

module.exports = new ProductModel();