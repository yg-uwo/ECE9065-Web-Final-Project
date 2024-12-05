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
          type: Map, // Allows dynamic keys
          of: String // Values of all keys are expected to be strings
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
        throw err; 
    }
  }

  async getAllProducts(){
    const result = await this.model.find();
  return result;
  }
  
}

module.exports = new ProductModel();