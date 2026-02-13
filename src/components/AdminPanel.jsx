import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeSection, setActiveSection] = useState('services');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('myProject_isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
      return;
    }

    setTimeout(() => {
      setServices([
        {
          id: 1,
          name: 'Замена масла',
          icon: '🔧',
          description: 'Профессиональная замена масла и фильтров',
          price: '2000₽'
        },
        {
          id: 2,
          name: 'Шиномонтаж',
          icon: '🚗',
          description: 'Балансировка и замена шин',
          price: '2500₽'
        },
        {
          id: 3,
          name: 'Диагностика',
          icon: '🔍',
          description: 'Компьютерная диагностика автомобиля',
          price: '1500₽'
        }
      ]);

      setClients([
        {
          id: 1,
          name: 'Иван Петров',
          phone: '+7 (999) 123-45-67',
          car: 'Toyota Camry',
          email: 'ivan@example.com'
        },
        {
          id: 2,
          name: 'Мария Сидорова',
          phone: '+7 (999) 765-43-21',
          car: 'Hyundai Solaris',
          email: 'maria@example.com'
        },
        {
          id: 3,
          name: 'Алексей Иванов',
          phone: '+7 (999) 555-55-55',
          car: 'Kia Rio',
          email: 'alex@example.com'
        }
      ]);
      
      setIsLoading(false);
    }, 500);
  }, [navigate]);

  const handleAddService = () => {
    const newService = {
      id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
      name: 'Новая услуга',
      icon: '➕',
      description: 'Описание новой услуги',
      price: '0₽'
    };
    setServices([...services, newService]);
    setSelectedInfo(newService);
  };

  const handleRemoveService = (service) => {
    if (!window.confirm(`Удалить услугу "${service.name}"?`)) return;
    setServices(services.filter(s => s.id !== service.id));
    if (selectedInfo && selectedInfo.id === service.id) {
      setSelectedInfo(null);
    }
  };

  const handleAddClient = () => {
    const newClient = {
      id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
      name: 'Новый клиент',
      phone: '+7 (___) ___-__-__',
      car: 'Марка автомобиля',
      email: 'email@example.com'
    };
    setClients([...clients, newClient]);
    setSelectedInfo(newClient);
  };

  const handleRemoveClient = (client) => {
    if (!window.confirm(`Удалить клиента "${client.name}"?`)) return;
    setClients(clients.filter(c => c.id !== client.id));
    if (selectedInfo && selectedInfo.id === client.id) {
      setSelectedInfo(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('myProject_isAdmin');
    navigate('/');
  };

  if (isLoading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Админ-панель AvtoShop</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          Выйти
        </button>
      </div>

      <div className="admin-content">
        {/* Левая колонка с кнопками */}
        <div className="admin-sidebar">
          <button 
            className={`admin-sidebar-btn ${activeSection === 'services' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('services');
              setSelectedInfo(null);
            }}
          >
            <span className="admin-btn-icon"></span>
            Услуги
          </button>
          
          <button 
            className="admin-sidebar-btn admin-add-btn"
            onClick={activeSection === 'services' ? handleAddService : handleAddClient}
          >
            <span className="admin-btn-icon"></span>
            {activeSection === 'services' ? 'Добавить услугу' : 'Добавить клиента'}
          </button>
          
          <button 
            className="admin-sidebar-btn admin-clients-btn"
            onClick={() => {
              setActiveSection('clients');
              setSelectedInfo(null);
            }}
          >
            <span className="admin-btn-icon"></span>
            Клиенты
          </button>
          
          <button 
            className="admin-sidebar-btn admin-remove-btn"
            onClick={() => {
              if (activeSection === 'services' && selectedInfo) {
                handleRemoveService(selectedInfo);
              } else if (activeSection === 'clients' && selectedInfo) {
                handleRemoveClient(selectedInfo);
              } else {
                alert('Сначала выберите элемент для удаления');
              }
            }}
          >
            <span className="admin-btn-icon"></span>
            {activeSection === 'services' ? 'Убрать услугу' : 'Убрать клиента'}
          </button>
        </div>

        {/* Правая колонка с фиксированным положением */}
        <div className="admin-right-column">
          <div className="admin-fixed-panel">
            {/* Верхняя часть с информацией */}
            <div className="admin-info-section">
              <h2 className="admin-info-title">
                {activeSection === 'services' ? 'Информация об услуге' : 'Информация о клиенте'}
              </h2>
              
              <div className="admin-info-content-fixed">
                {selectedInfo ? (
                  activeSection === 'services' ? (
                    <div className="admin-service-details">
                      <div className="admin-info-icon">{selectedInfo.icon}</div>
                      <div className="admin-info-row">
                        <span className="admin-label">Название:</span>
                        <span className="admin-value">{selectedInfo.name}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-label">Описание:</span>
                        <span className="admin-value">{selectedInfo.description}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-label">Цена:</span>
                        <span className="admin-value admin-price">{selectedInfo.price}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-client-details">
                      <div className="admin-info-row">
                        <span className="admin-label">Имя:</span>
                        <span className="admin-value">{selectedInfo.name}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-label">Телефон:</span>
                        <span className="admin-value">{selectedInfo.phone}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-label">Автомобиль:</span>
                        <span className="admin-value">{selectedInfo.car}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-label">Email:</span>
                        <span className="admin-value">{selectedInfo.email}</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="admin-info-empty-fixed">
                    {activeSection === 'services' 
                      ? 'Выберите услугу из списка'
                      : 'Выберите клиента из списка'
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Нижняя часть со списком */}
            <div className="admin-list-section">
              <h3 className="admin-list-title">
                {activeSection === 'services' ? 'Список услуг' : 'Список клиентов'}
              </h3>
              
              <div className="admin-list-scroll">
                {activeSection === 'services' ? (
                  services.map(service => (
                    <div 
                      key={service.id}
                      className={`admin-list-item ${selectedInfo?.id === service.id ? 'selected' : ''}`}
                      onClick={() => setSelectedInfo(service)}
                    >
                      <span className="admin-item-icon">{service.icon}</span>
                      <span className="admin-item-name">{service.name}</span>
                      <span className="admin-item-price">{service.price}</span>
                    </div>
                  ))
                ) : (
                  clients.map(client => (
                    <div 
                      key={client.id}
                      className={`admin-list-item ${selectedInfo?.id === client.id ? 'selected' : ''}`}
                      onClick={() => setSelectedInfo(client)}
                    >
                      <span className="admin-item-icon">👤</span>
                      <span className="admin-item-name">{client.name}</span>
                      <span className="admin-item-car">{client.car}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;