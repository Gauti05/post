import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import NavigationBar from './components/NavigationBar';


const AppRouter = process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;

function PrivateRoute({ children }) {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter>
        <NavigationBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
            <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AppRouter>
    </AuthProvider>
  );
}

export default App;
