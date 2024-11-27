import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from '../redux/auth_slice';
import homepage_image from '../assets/images/homepage.jpg'


const Auth = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
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
            if (!formData.phone) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = 'Phone number must be 10 digits';
            }

            if (!formData.firstName) newErrors.firstName = 'First name is required';
            if (!formData.lastName) newErrors.lastName = 'Last name is required';
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
            let response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            let { token } = await response.json();
            let decodedToken = jwtDecode(token);

            dispatch(
                login({
                    userId: decodedToken.id,
                    role: decodedToken.role,
                })
            );

            navigate('/products');
        } catch (error) {
            setApiError(error.message);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Row>
                <Col md={6}>
                    <img
                        src={homepage_image}
                        alt="Placeholder"
                        className="img-fluid"
                    />
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h3 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h3>
                            {apiError && <Alert variant="danger">{apiError}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <>
                                        <Form.Group controlId="firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.firstName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.lastName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="phone">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.phone}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </>
                                )}
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
