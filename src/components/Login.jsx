import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации');
      }

      if (data.success) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError(data.message || 'Доступ запрещен');
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Ошибка соединения с сервером');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center' }}>Вход в админ-панель</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '10px', fontSize: '16px' }}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          style={{ padding: '10px', fontSize: '16px' }}
          required
        />
        <button 
          type="submit" 
          style={{
            padding: '10px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Войти
        </button>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
};

export default Login;