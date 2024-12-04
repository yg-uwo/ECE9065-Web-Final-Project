const ProductService = require('../services/product.services');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const ProductModel = require('../models/product.models');
const Product = ProductModel.getModel();
const { getJson } = require("serpapi");

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
      const { productId } = req.params;
      //console.log(productId)
      const product = await ProductService.getProductById(productId);
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

  async fillReviews(req, res) {
    const { productId } = req.params; 
  
    try {
      // Fetch reviews from SerpAPI
      const productDetails = await getJson({
        api_key: process.env.SERP_API_KEY,
        engine: 'walmart_product_reviews',
        product_id: productId,
      });
  
      // console.log(productDetails);
      if (!productDetails.reviews || productDetails?.reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this product' });
      }
  
      // Process and map reviews to match your model
      const processedReviews = productDetails.reviews.map((review) => {
        return {
          user_nickname: review.user_nickname,
          title:review.title,
          text:review.text,
          positive_feedback:review.positive_feedback,
          negative_feedback:review.negative_feedback,
          rating: review.rating || 0,
          comment: review.text || 'No comment',
          review_submission_time: review.review_submission_time,
        };
      });
  
      const product = await Product.findOne({ productId:productId });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.reviews = [...product.reviews, ...processedReviews];
      await product.save();
      res.status(200).json({
        message: 'Product reviews successfully updated.',
        product: product,
      });
  
    } catch (error) {
      console.error('Error updating reviews:', error);
      res.status(500).json({
        message: 'Error fetching and updating product reviews',
        error: error.message,
      });
    }
  }
}




module.exports = new ProductController();
