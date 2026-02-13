import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Проверяем, есть ли флаг авторизации в localStorage
  const isAdmin = localStorage.getItem('myProject_isAdmin') === 'true';
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Если авторизован, показываем защищенный компонент
  return children;
};

export default ProtectedRoute;