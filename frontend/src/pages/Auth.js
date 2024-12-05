import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from '../redux/auth_slice';
import homepage_image from '../assets/images/homepage.jpg'
import { toast } from 'react-toastify';
import '../assets/css/auth.css'


const Auth = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Invalid Password';
        }

        if (!isLogin) {
            if (!formData.phoneNumber) {
                newErrors.phoneNumber = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
                newErrors.phoneNumber = 'Phone number must be 10 digits';
            }

            if (!formData.first_name) newErrors.first_name = 'First name is required';
            if (!formData.last_name) newErrors.last_name = 'Last name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) return;

        try {
            let api = isLogin ? `${apiUrl}/auth/login` : `${apiUrl}/auth/signup`;
            // console.log(api);
            let response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (isLogin) {
                if (!response.ok) {
                    
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Authentication failed');
                }

                let { token } = await response.json();
                let decodedToken = jwtDecode(token);

                dispatch(
                    login({
                        token: token,
                        userId: decodedToken.id,
                        role: decodedToken.role,
                        email:formData.email
                    })
                );

                navigate('/products');
            } else {
                if (response.ok) {
                    toast.success("Registered Successfully, Please log in to continue");
                } else {
                    const errorData = await response.json(); 
                    const errorMessage = errorData.message || "Registration failed";
                    toast.error(errorMessage); 
                }
            }
        } catch (error) {
            console.log(error)
            setApiError(error.message);
        }
    };

    return (
        <Container className="container_auth">
            <Row className="auth-row">
                {/* Image Side */}
                <Col md={6} className="image-side">
                    <img src={homepage_image} alt="Homepage" />
                </Col>

                {/* Form Section */}
                <Col md={6} className="form-section">
                    <Card className="form-card">
                        <Card.Body>
                            <h3 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h3>
                            {apiError && <Alert variant="danger">{apiError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                {/* Conditional fields for Sign Up */}
                                {!isLogin && (
                                    <>
                                        <Form.Group controlId="first_name">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.first_name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.first_name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="last_name">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.last_name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.last_name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="phoneNumber">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.phoneNumber}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phoneNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </>
                                )}
                                
                                {/* Common fields for both Login and Sign Up */}
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </Button>
                            </Form>

                            
                            <div className="text-center mt-3">
                                {isLogin ? (
                                    <p>
                                        Don't have an account?{' '}
                                        <Button
                                            variant="link"
                                            onClick={() => setIsLogin(false)}
                                            className="p-0"
                                        >
                                            Sign Up
                                        </Button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have an account?{' '}
                                        <Button
                                            variant="link"
                                            onClick={() => setIsLogin(true)}
                                            className="p-0"
                                        >
                                            Login
                                        </Button>
                                    </p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Auth;
