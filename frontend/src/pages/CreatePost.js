import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function CreatePost() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim() && !image) {
      setError('Please enter text or select an image');
      return;
    }
    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);

      await axios.post(`${API_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        // DO NOT set Content-Type header manually
      });

      navigate('/'); // Redirect to home or posts page after success
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized: Please login again.');
      } else {
        setError('Failed to create post');
      }
      console.error('Create post error:', err);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '600px' }}>
      <Card className="shadow p-4">
        <h2 className="mb-3">Create a New Post</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="postText">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="postImage">
            <Form.Label>Image (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="fw-semibold px-4 py-2 shadow-sm"
            size="lg"
          >
            Post
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
