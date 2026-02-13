import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Проверяем, есть ли токен авторизации в localStorage,
  // который был сохранен компонентом Login.jsx
  const token = localStorage.getItem('authToken');
  
  // Если токена нет, значит пользователь не вошел в систему.
  // Перенаправляем его на страницу входа.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Если токен на месте, значит все в порядке.
  // Показываем тот компонент, который был обернут в ProtectedRoute (в нашем случае AdminPanel).
  return children;
};

export default ProtectedRoute;
