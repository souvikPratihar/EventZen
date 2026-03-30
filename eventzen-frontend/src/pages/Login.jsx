import { useEffect, useState } from 'react';
import { loginUser, isLoggedIn, getUserRole } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoggedIn()) {
      const role = getUserRole();

      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser({ email, password });

      const role = getUserRole();

      showToast('Login successful', 'success');

      setTimeout(() => {
        if (role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="card centered-card auth-form">
        <h1 className="page-title">Login</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;