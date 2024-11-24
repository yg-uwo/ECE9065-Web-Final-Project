const ProductService = require('../services/product.services');
const { SUCCESS_MESSAGES } = require('../utils/constants');

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ message: SUCCESS_MESSAGES.PRODUCT_CREATED, product });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.status(200).json({ product });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { productId, ...updateData } = req.body;
      const updatedProduct = await ProductService.updateProduct(id, updateData);
      res.status(200).json({ message: SUCCESS_MESSAGES.PRODUCT_UPDATED, product: updatedProduct });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(200).json({ message: SUCCESS_MESSAGES.PRODUCT_DELETED });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

}

module.exports = new ProductController();
