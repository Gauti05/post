import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Card,
  Button,
  Form,
  ListGroup,
  Alert,
  Container,
  Spinner,
  Badge,
  Image,
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentTextMap, setCommentTextMap] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, username } = useContext(AuthContext);

  const fetchPosts = () => {
    setLoading(true);
    axios
      .get('https://post-nd9p.onrender.com/posts')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = postId => {
    axios
      .patch(
        `http://localhost:5000/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setPosts(posts.map(p => (p._id === postId ? res.data : p)));
      })
      .catch(() => setError('Failed to like post'));
  };

  const addComment = (postId) => {
    const commentText = commentTextMap[postId];
    if (!commentText || !commentText.trim()) return;

    axios
      .post(
        `http://localhost:5000/posts/${postId}/comment`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setPosts(posts.map(p => (p._id === postId ? res.data : p)));
        setCommentTextMap({ ...commentTextMap, [postId]: '' });
      })
      .catch(() => setError('Failed to add comment'));
  };

  const handleCommentChange = (postId, value) => {
    setCommentTextMap({ ...commentTextMap, [postId]: value });
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: '720px' }} className="my-4">
      <h2 className="mb-4 text-center text-primary fw-bold">Social Feed</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {posts.length === 0 && <p className="text-center">No posts available. Create the first post!</p>}
      {posts.map(post => {
        const liked = post.likes.includes(username);
        return (
          <Card key={post._id} className="mb-4 shadow-sm rounded">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                  style={{ width: '40px', height: '40px', fontWeight: '700', fontSize: '20px', userSelect: 'none' }}
                  title={post.username}
                >
                  {post.username.charAt(0).toUpperCase()}
                </div>
                <Card.Title className="mb-0">{post.username}</Card.Title>
                <Badge bg="info" className="ms-auto align-self-start small">
                  {new Date(post.createdAt).toLocaleString()}
                </Badge>
              </div>
              {post.text && <Card.Text className="fs-5">{post.text}</Card.Text>}
              {post.imageUrl && (
                <div className="mb-3 d-flex justify-content-center">
                  <Image
                    src={`http://localhost:5000${post.imageUrl}`}
                    alt="Post"
                    fluid
                    rounded
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
              )}
              <div className="d-flex gap-3 mb-3">
                <Button
                  variant={liked ? 'primary' : 'outline-primary'}
                  onClick={() => likePost(post._id)}
                  className="shadow-sm"
                >
                  {liked ? 'Unlike' : 'Like'} ({post.likes.length})
                </Button>
                <Button variant="outline-secondary" disabled className="shadow-sm">
                  Comments ({post.comments.length})
                </Button>
              </div>
              <ListGroup variant="flush" className="mb-3">
                {post.comments.map((c, i) => (
                  <ListGroup.Item key={i} className="d-flex align-items-start">
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-3"
                      style={{ width: '32px', height: '32px', fontWeight: '600', fontSize: '16px', userSelect: 'none' }}
                      title={c.username}
                    >
                      {c.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{c.username}</strong>{' '}
                      <small className="text-muted">- {new Date(c.createdAt).toLocaleString()}</small>
                      <div>{c.comment}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  addComment(post._id);
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Add a comment..."
                  value={commentTextMap[post._id] || ''}
                  onChange={e => handleCommentChange(post._id, e.target.value)}
                  className="shadow-sm"
                  autoComplete="off"
                />
              </Form>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
}
