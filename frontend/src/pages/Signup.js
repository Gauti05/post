import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUsername } = useContext(AuthContext);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('https://post-nd9p.onrender.com/auth/signup', formData);
      const res = await axios.post('http://localhost:5000/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      setToken(res.data.token);
      setUsername(res.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center fw-bold mb-4">Create Account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-4" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 fw-semibold shadow-sm" size="lg">
            Signup
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
