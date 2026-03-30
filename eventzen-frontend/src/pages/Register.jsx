import { useEffect, useState } from 'react';
import { registerUser, isLoggedIn, getUserRole } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

function Register() {
  const [name, setName] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
        role: 'CUSTOMER'
      });

      showToast('Registration successful', 'success');

      setTimeout(() => {
        navigate('/login');
      }, 700);
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="card centered-card auth-form">
        <h2 className="page-title">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="secondary-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;