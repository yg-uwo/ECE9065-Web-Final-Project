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

  async listProducts(req, res) {
    try {
      const {
        category,
        manufacturer,
        title,
        price,
        page = 1,
        limit = 10,
        sort = 'popularity',
        order = 'desc',
      } = req.query;
      const filter = {};
      if (category) filter.category = { $regex: category, $options: 'i' };
      if (manufacturer) filter.manufacturer = { $regex: manufacturer, $options: 'i' };
      if (title) filter.title = { $regex: title, $options: 'i' };
      if (price) filter.price = { $lte: price }; // Filter by price less than or equal to the given value
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;

      //sorting by popularity
      const sortOrder = order === 'asc' ? 1 : -1; 
      const sortBy = {};
      sortBy[sort] = sortOrder;
      
      const products = await ProductService.listProducts(filter, skip, pageSize, sortBy);
      const totalProducts = await ProductService.countProducts(filter); 

      res.status(200).json({
        data: products,
        total: totalProducts,
        page: pageNumber,
        limit: pageSize,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new ProductController();
