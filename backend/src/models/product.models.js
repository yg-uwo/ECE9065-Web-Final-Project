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
        price: { type: Number, required: true },
        category: { type: String, required: true },
        manufacturer: { type: String },
        popularity: { type: Number, default: 0 },
        quantity: { type: Number, default: 0 },
        reviews: [{  
          title: { type: String },   
          rating: { type: Number },      
          text: { type: String },  
          positive_feedback:{type:Number},
          negative_feedback:{type:Number},
          review_submission_time: { type: String },
          user_nickname:{type:String}   
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

  async updateProductStock(productId, quantity) {
    console.log("ProductID:", productId);
    const result = "";
    try {
      result = this.model.findByIdAndUpdate({_id: productId}, { $inc: { quantity } });
    } catch(err) {
      console.log("Error in payments", err);
    }
    return result;
  }
}

module.exports = new ProductModel().getModel();

