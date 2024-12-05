import React, { useState, useEffect } from 'react';
import { validUrl } from "../utils/validation";


const AddProductForm = ({ onAddProduct, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
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
    laptop: ["operating_system",
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
      "backlit_keyboard"],
    keyboard: ["key_type", "connection_type", "compatibility", "backlight"],
    mouse: ["sensor_type",
      "dpi",
      "buttons",
      "wireless",
      "color"],
    bag: ["material",
      "dimensions",
      "compartments",
      "strap_type",
      "laptop_compatible"],
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



  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.productId) newErrors.productId = "Product ID is required";
    if (!formData.manufacturer) newErrors.manufacturer = "Manufacturer is required";
    if (formData.price === '' || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (formData.popularity === '' || isNaN(formData.popularity)) newErrors.popularity = "Valid popularity is required";
    if (formData.quantity === '' || isNaN(formData.quantity)) newErrors.quantity = "Valid quantity is required";

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
    if (formData.category) {
      const newSpecifications = specificationSchema[formData.category] || [];
      const newSpecData = newSpecifications.reduce((acc, field) => {
        acc[field] = '';
        return acc;
      }, {});
      setFormData((prevData) => ({
        ...prevData,
        specification: newSpecData, 
      }));
    }
  }, [formData.category]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
        <div className="form-group mb-3">
          <label className="form_label">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.title && <span>{errors.title}</span>}
        </div>
        
        <div className="form-group mb-3">
          <label className="form_label">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.price && <span>{errors.price}</span>}
        </div>
        <div className="form-group mb-3">
          <label className="form_label">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span>{errors.category}</span>}
        </div>
        <h6 className='text-center'>Specification</h6>

        {Object.keys(formData.specification).map((specField) => (
          <div className="form-group mb-3" key={specField}>
            <label className="form_label_spec">{specField.replace('_', ' ').toUpperCase()}:</label>
            <input
              type="text"
              name={`specification.${specField}`}
              value={formData.specification[specField]}
              onChange={handleInputChange}
              className="form-control"
            />
            {errors[`specification.${specField}`] && <span>{errors[`specification.${specField}`]}</span>}
          </div>
        ))}
        <hr className="danger"></hr>
        <div className="form-group mb-3">
          <label className="form_label">Manufacturer:</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.manufacturer && <span>{errors.manufacturer}</span>}
        </div>
        <div className="form-group mb-3">
          <label className="form_label">Product ID:</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.productId && <span>{errors.productId}</span>}
        </div>
        <div className="form-group mb-3">
          <label className="form_label">Popularity:</label>
          <input
            type="number"
            name="popularity"
            value={formData.popularity}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.popularity && <span>{errors.popularity}</span>}
        </div>
        <div className="form-group mb-3">
          <label className="form_label">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {errors.quantity && <span>{errors.quantity}</span>}
        </div>
        <div>
          <button type="submit" className="btn btn-primary w-100 py-2">Add Product</button>
        </div>
      </form>

    </div>
  );
};

export default AddProductForm;
