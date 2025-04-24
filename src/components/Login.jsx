import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();

  // Проверка: если уже авторизован — редирект на /admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('myProject_isAdmin');
    if (isAdmin === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации');
      }

      if (data.success) {
        // Сохраняем данные в localStorage
        localStorage.setItem('myProject_isAdmin', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        }));
        navigate('/admin');
      } else {
        setError(data.message || 'Доступ запрещён');
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Ошибка соединения с сервером');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Вход в админ-панель</h2>
        {error && <div className="login-error">{error}</div>}

        <div className={`login-input-group ${focusedField === 'email' ? 'focused' : ''}`}>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            onChange={(e) => setEmail(e.target.value)}
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
