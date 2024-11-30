import React, { useState, useEffect } from 'react';
import { validUrl } from "../utils/validation";


const AddProductForm = ({ onAddProduct, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    images: [],
    price: '',
    category: '',
    manufacturer: '',
    productId: '',
    popularity: '',
    quantity: '',
    specification: {},
  });

  const [categories] = useState(["laptop", "keyboard", "mouse", "bag"]);

  const specificationSchema = {
    laptop: ["operating_system", "standard_memory", "battery_life", "cpu_model"],
    keyboard: ["key_type", "connection_type", "compatibility", "backlight"],
    mouse: ["sensor_type", "dpi", "buttons", "color"],
    bag: ["material", "size", "compartments"],
  };

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("specification")) {
      const specificationKey = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        specification: {
          ...prevData.specification,
          [specificationKey]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      images: value.split(','),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.productId) newErrors.productId = "Product ID is required";
    if (!formData.manufacturer) newErrors.manufacturer = "Manufacturer is required";
    if (formData.price === '' || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (formData.popularity === '' || isNaN(formData.popularity)) newErrors.popularity = "Valid popularity is required";
    if (formData.quantity === '' || isNaN(formData.quantity)) newErrors.quantity = "Valid quantity is required";

    //Validate image URLs
    // const invalidUrls = formData.images.filter((url) => !validUrl(url));
    // if (invalidUrls.length > 0) {
    //   newErrors.images = "Some of the image URLs are invalid";
    // }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    onAddProduct(formData);
  };

  useEffect(() => {
    // Reset specifications when category changes
    if (formData.category) {
      const newSpecifications = specificationSchema[formData.category] || [];
      const newSpecData = newSpecifications.reduce((acc, field) => {
        acc[field] = ''; // Initialize fields to empty strings
        return acc;
      }, {});
      setFormData((prevData) => ({
        ...prevData,
        specification: newSpecData, // Set the specification data based on the selected category
      }));
    }
  }, [formData.category]);

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          {errors.title && <span>{errors.title}</span>}
        </div>
        
        <div>
          <label>Images (comma-separated URLs):</label>
          <input
            type="text"
            name="images"
            value={formData.images.join(',')}
            onChange={handleImageChange}
            required
          />
          {/* {errors.images && <span>{errors.images}</span>} */}
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          {errors.price && <span>{errors.price}</span>}
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span>{errors.category}</span>}
        </div>

        {/* Render dynamic specification fields based on selected category */}
        {Object.keys(formData.specification).map((specField) => (
          <div key={specField}>
            <label>{specField.replace('_', ' ').toUpperCase()}:</label>
            <input
              type="text"
              name={`specification.${specField}`}
              value={formData.specification[specField]}
              onChange={handleInputChange}
            />
            {errors[`specification.${specField}`] && <span>{errors[`specification.${specField}`]}</span>}
          </div>
        ))}

        <div>
          <label>Manufacturer:</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            required
          />
          {errors.manufacturer && <span>{errors.manufacturer}</span>}
        </div>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            required
          />
          {errors.productId && <span>{errors.productId}</span>}
        </div>
        <div>
          <label>Popularity:</label>
          <input
            type="number"
            name="popularity"
            value={formData.popularity}
            onChange={handleInputChange}
            required
          />
          {errors.popularity && <span>{errors.popularity}</span>}
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          {errors.quantity && <span>{errors.quantity}</span>}
        </div>
        <div>
          <button type="submit">Add Product</button>
        </div>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddProductForm;
