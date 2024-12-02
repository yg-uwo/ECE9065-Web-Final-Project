const ProductModel = require('../models/product.models');
const Product = ProductModel.getModel();
const { ERROR_MESSAGES } = require('../utils/constants');

class ProductService {
  static specificationMapping = {
    laptop: [
      "operating_system",
      "standard_memory",
      "battery_life",
      "cpu_model",
      "processor_brand",
      "processor_name",
      "ram_type",
      "ram_speed",
      "gpu_type",
      "gpu_memory",
      "display_size",
      "display_resolution",
      "weight",
      "storage_type",
      "storage_capacity",
      "usb_ports",
      "hdmi_ports",
      "bluetooth",
      "wifi",
      "webcam",
      "keyboard_type",
      "backlit_keyboard",
    ],
    keyboard: [
      "key_type",
      "connection_type",
      "compatibility",
      "backlight"
    ],
    mouse: [
      "sensor_type",
      "dpi",
      "buttons",
      "wireless",
      "color"
    ],
    bag: [
      "material",
      "dimensions",
      "compartments",
      "strap_type",
      "laptop_compatible"
    ]
  };


  async createProduct(data) {
    if (!data.productId || !data.category) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // console.log("Available categories:", Object.keys(ProductService.specificationMapping));
    const requiredSpecs = ProductService.specificationMapping[data.category];
    if (!requiredSpecs) {
      throw new Error(`Unsupported category: ${data.category}`);
    }

    const product = new Product(data);
    return product.save();
  }

  async getProductById(productId) {
    const product = await Product.findOne({ _id:productId });
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

  async listProducts(filter, skip, limit, sortBy) {
    return Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortBy);
  }

  async countProducts(filter) {
    return Product.countDocuments(filter);
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
