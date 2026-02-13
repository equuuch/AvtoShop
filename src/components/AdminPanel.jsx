import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';

// Create an axios instance for authenticated requests
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Renamed to fetchServices for clarity
  const fetchServices = useCallback(async () => {
    try {
      const response = await api.get('/products');
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      // Optional: Handle unauthorized access, e.g., redirect to login
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    fetchServices().finally(() => setIsLoading(false));
  }, [navigate, fetchServices]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleAddService = async () => {
    const newServiceName = prompt("Введите название новой услуги:", "Новая услуга");
    if (!newServiceName) return;

    const newService = {
      name: newServiceName,
      description: 'Описание по умолчанию',
      price: 0,
    };

    try {
      const response = await api.post('/products', newService);
      setServices([...services, response.data]); // Add new service to the list
      setSelectedService(response.data); // Select the new service
      setIsEditing(true); // Immediately open for editing
    } catch (error) {
      console.error("Failed to add service:", error);
      alert('Не удалось добавить услугу.');
    }
  };

  const handleRemoveService = async (service) => {
    if (!service || !service.id) {
        alert('Сначала выберите услугу для удаления.');
        return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить "${service.name}"?`)) return;

    try {
      await api.delete(`/products/${service.id}`);
      setServices(services.filter(s => s.id !== service.id));
      setSelectedService(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert('Не удалось удалить услугу.');
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const response = await api.put(`/products/${selectedService.id}`, selectedService);
      // Update the list with the new data
      setServices(services.map(s => (s.id === selectedService.id ? response.data : s)));
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Failed to update service:", error);
      alert('Не удалось обновить услугу.');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedService({ ...selectedService, [name]: value });
  };

  if (isLoading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Админ-панель</h1>
        <button onClick={handleLogout} className="admin-logout-btn">Выйти</button>
      </div>
      <div className="admin-content">
        <div className="admin-sidebar">
            <h3>Управление</h3>
            <button className="admin-sidebar-btn admin-add-btn" onClick={handleAddService}>
                Добавить услугу
            </button>
            <button className="admin-sidebar-btn admin-remove-btn" onClick={() => handleRemoveService(selectedService)}>
                Удалить выбранное
            </button>
        </div>

        <div className="admin-main-content">
            <div className="admin-list-section">
              <h3 className="admin-list-title">Список услуг</h3>
              <div className="admin-list-scroll">
                {services.map(service => (
                  <div 
                    key={service.id}
                    className={`admin-list-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedService(service)
                        setIsEditing(false); // Reset editing state on new selection
                    }}
                  >
                    <span className="admin-item-name">{service.name}</span>
                    <span className="admin-item-price">{service.price} ₽</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-info-section">
                <h2 className="admin-info-title">Информация об услуге</h2>
                <div className="admin-info-content">
                {selectedService ? (
                  isEditing ? (
                    <form onSubmit={handleUpdateService} className="admin-edit-form">
                      <div className="admin-info-row">
                          <label className="admin-label">Название:</label>
                          <input type="text" name="name" value={selectedService.name} onChange={handleInputChange} className="admin-input"/>
                      </div>
                      <div className="admin-info-row">
                          <label className="admin-label">Описание:</label>
                          <textarea name="description" value={selectedService.description || ''} onChange={handleInputChange} className="admin-textarea"></textarea>
                      </div>
                      <div className="admin-info-row">
                          <label className="admin-label">Цена:</label>
                          <input type="number" name="price" value={selectedService.price} onChange={handleInputChange} className="admin-input"/>
                      </div>
                      <div className="admin-form-buttons">
                        <button type="submit" className="admin-btn-save">Сохранить</button>
                        <button type="button" className="admin-btn-cancel" onClick={() => setIsEditing(false)}>Отмена</button>
                      </div>
                    </form>
                  ) : (
                    <div className="admin-service-details">
                       <div className="admin-info-row">
                          <span className="admin-label">Название:</span>
                          <span className="admin-value">{selectedService.name}</span>
                        </div>
                        <div className="admin-info-row">
                          <span className="admin-label">Описание:</span>
                          <span className="admin-value">{selectedService.description || '---'}</span>
                        </div>
                        <div className="admin-info-row">
                          <span className="admin-label">Цена:</span>
                          <span className="admin-value admin-price">{selectedService.price} ₽</span>
                        </div>
                        <button className="admin-btn-edit" onClick={() => setIsEditing(true)}>Редактировать</button>
                    </div>
                  )
                ) : (
                  <div className="admin-info-empty">
                    Выберите услугу из списка, чтобы посмотреть детали или добавить новую.
                  </div>
                )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
