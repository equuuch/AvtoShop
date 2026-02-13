import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // We'll use axios to make the API call
import '../styles/Login.css';

const Login = () => {
  // Changed state from 'email' to 'username' to match the backend
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!username || !password) {
      setError('Имя пользователя и пароль обязательны');
      return;
    }

    try {
      // The proxy in package.json will redirect this request to your backend
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      // Assuming the backend returns a token upon successful login
      const { token } = response.data;

      // Store the token in localStorage for future authenticated requests
      localStorage.setItem('authToken', token);

      // Redirect to the admin panel
      navigate('/admin');

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Неверное имя пользователя или пароль');
      } else {
        setError('Произошла ошибка входа. Попробуйте снова.');
        console.error('Login error:', err);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Вход в админ-панель</h2>
        {error && <div className="login-error">{error}</div>}
        <div className={`login-input-group ${focusedField === 'username' ? 'focused' : ''}`}>
          {/* Changed label from Email to Имя пользователя */}
          <label className="login-label">Имя пользователя</label>
          <input
            type="text" // Changed type from email to text
            className="login-input"
            value={username}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField('')}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={`login-input-group ${focusedField === 'password' ? 'focused' : ''}`}>
          <label className="login-label">Пароль</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField('')}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Войти</button>
      </form>
    </div>
  );
};

export default Login;
