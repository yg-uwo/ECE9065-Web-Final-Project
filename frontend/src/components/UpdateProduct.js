import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';

const UpdateProduct = ({ productId, onUpdateProduct, onClose }) => {
    const baseUrl = process.env.REACT_APP_API_URL;
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
    const [errors, setErrors] = useState({});


    const specificationSchema = {
        laptop: ["operating_system", "standard_memory", "battery_life", "cpu_model", "processor_brand",
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
        mouse: ["sensor_type", "dpi", "buttons", "wireless", "color"],
        bag: ["material", "dimensions", "compartments", "strap_type", "laptop_compatible"],
    };

    
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {

                const response = await fetch(`${baseUrl}/product/${productId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                const specifications = specificationSchema[data.product.category]?.reduce((acc, field) => {
                    acc[field] = data.product.specification[field] || '';
                    return acc;
                }, {}) || {};

                setFormData({
                    ...data.product,
                    specification: specifications,
                });
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

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

        if (!validateForm()) {
            return;
        }

        onUpdateProduct(formData);
    };



    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label className="form_label">Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mb-3">
                        <Form.Label className="form_label">Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group controlId="formCategory" className="mb-3">
                        <Form.Label className="form_label">Category</Form.Label>
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            disabled
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {formData.category &&
                        specificationSchema[formData.category]?.map((field) => (
                            <Form.Group key={field} controlId={`formSpec.${field}`} className="mb-3">
                                <Form.Label className="form_label">{field.replace('_', ' ').toUpperCase()}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`specification.${field}`}
                                    value={formData.specification[field] || ''}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </Form.Group>
                        ))}

                    <Form.Group controlId="formManufacturer" className="mb-3">
                        <Form.Label className="form_label">Manufacturer</Form.Label>
                        <Form.Control
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group controlId="formPopularity" className="mb-3">
                        <Form.Label className="form_label">Popularity</Form.Label>
                        <Form.Control
                            type="number"
                            name="popularity"
                            value={formData.popularity}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group controlId="formQuantity" className="mb-3">
                        <Form.Label className="form_label">Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
           
        </Modal>
    );
};

export default UpdateProduct;
