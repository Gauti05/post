import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavigationBar() {
  const { token, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onLoginPage = location.pathname === '/login';
  const onSignupPage = location.pathname === '/signup';

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-primary">
          Mini Social
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            {token && (
              <Nav.Link as={Link} to="/create-post" className="fw-semibold text-white">
                Create Post
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {token ? (
              <>
                <div className="d-flex align-items-center me-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
                    style={{ width: '36px', height: '36px', fontWeight: '700', fontSize: '18px', userSelect: 'none' }}
                    title={username}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white fs-6">{username}</span>
                </div>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {!onSignupPage && (
                  <Nav.Link as={Link} to="/signup" className="text-white me-3">
                    Signup
                  </Nav.Link>
                )}
                {!onLoginPage && (
                  <Nav.Link as={Link} to="/login" className="text-white">
                    Login
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
