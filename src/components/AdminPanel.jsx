import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';
import { FiUsers, FiEdit, FiTrash2, FiPlusCircle, FiTool, FiLogOut, FiPhone, FiTruck, FiStar } from 'react-icons/fi';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Модальные окна ---

const ServiceModal = ({ service, onSave, onClose, isVisible }) => {
  const [edited, setEdited] = useState({});
  useEffect(() => {
    setEdited(service || { name: '', description: '', price: '' });
  }, [service, isVisible]);

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setEdited(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setEdited(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...edited, price: Number(edited.price) || 0 });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>{service?.id ? 'Редактировать услугу' : 'Добавить услугу'}</h2>
          <div className="form-group"><label>Название</label><input type="text" name="name" value={edited.name || ''} onChange={handleChange} required /></div>
          <div className="form-group"><label>Описание</label><textarea name="description" value={edited.description || ''} onChange={handleChange} required></textarea></div>
          <div className="form-group"><label>Цена</label><input type="text" name="price" placeholder="Например, 1500" value={edited.price ? `${edited.price} ₽` : ''} onChange={handleChange} required /></div>
          <div className="modal-actions"><button type="button" onClick={onClose} className="btn-secondary">Отмена</button><button type="submit" className="btn-primary">Сохранить</button></div>
        </form>
      </div>
    </div>
  );
};

const ClientModal = ({ client, onSave, onClose, isVisible }) => {
    const [edited, setEdited] = useState({});
    useEffect(() => { 
        setEdited(client || { name: '', phone: '', car: '' });
    }, [client, isVisible]);

    if (!isVisible) return null;

    const handlePhoneChange = (e) => {
        let input = e.target.value.replace(/\D/g, '');
        if (input.length > 0 && !['7', '8'].includes(input[0])) {
          input = '7' + input;
        }
        let formatted = '+7';
        if (input.length > 1) formatted += ` (${input.substring(1, 4)}`;
        if (input.length >= 5) formatted += `) ${input.substring(4, 7)}`;
        if (input.length >= 8) formatted += `-${input.substring(7, 9)}`;
        if (input.length >= 10) formatted += `-${input.substring(9, 11)}`;
        setEdited(prev => ({ ...prev, phone: formatted.slice(0, 18) }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEdited(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(edited); };

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <h2>{client?.id ? 'Редактировать клиента' : 'Добавить клиента'}</h2>
            <div className="form-group"><label>ФИО</label><input type="text" name="name" value={edited.name || ''} onChange={handleChange} required /></div>
            <div className="form-group"><label>Телефон</label><input type="tel" name="phone" value={edited.phone || ''} onChange={handlePhoneChange} placeholder="+7 (999) 123-45-67" required /></div>
            <div className="form-group"><label>Автомобиль</label><input type="text" name="car" value={edited.car || ''} onChange={handleChange} required /></div>
            <div className="modal-actions"><button type="button" onClick={onClose} className="btn-secondary">Отмена</button><button type="submit" className="btn-primary">Сохранить</button></div>
          </form>
        </div>
      </div>
    );
};

const ReviewModal = ({ review, onSave, onClose, isVisible }) => {
  const [edited, setEdited] = useState({});
  useEffect(() => {
    setEdited(review || { name: '', text: '', rating: 3 });
  }, [review, isVisible]);

  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...edited, rating: Number(edited.rating) || 3 });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>Редактировать отзыв</h2>
          <div className="form-group"><label>Имя</label><input type="text" name="name" value={edited.name || ''} onChange={handleChange} required /></div>
          <div className="form-group"><label>Текст</label><textarea name="text" value={edited.text || ''} onChange={handleChange} required></textarea></div>
          <div className="form-group"><label>Рейтинг (1-5)</label><input type="number" name="rating" min="1" max="5" value={edited.rating || ''} onChange={handleChange} required /></div>
          <div className="modal-actions"><button type="button" onClick={onClose} className="btn-secondary">Отмена</button><button type="submit" className="btn-primary">Сохранить</button></div>
        </form>
      </div>
    </div>
  );
};


// --- Основной компонент админ-панели ---
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [isClientModalVisible, setClientModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const navigate = useNavigate();

  const handleApiError = useCallback((error) => {
    console.error("API Error:", error);
    if (error.response && [401, 403].includes(error.response.status)) {
      alert("Ваша сессия истекла или у вас нет прав. Пожалуйста, войдите заново.");
      localStorage.removeItem('authToken');
      navigate('/login');
    } else {
      alert('Произошла ошибка при выполнении запроса. Проверьте консоль бэкенда.');
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [servicesRes, clientsRes, reviewsRes] = await Promise.all([api.get('/products'), api.get('/clients'), api.get('/reviews')]);
      setServices(servicesRes.data);
      setClients(clientsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
        handleApiError(error)
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        navigate('/login');
    } else {
        fetchData();
    }
  }, [navigate, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleSave = async (item, type) => {
    const isNew = !item.id;
    const endpoint = `/${type}`;
    const method = isNew ? 'post' : 'put';
    const url = isNew ? endpoint : `${endpoint}/${item.id}`;

    try {
      const { data } = await api[method](url, item);
      if (type === 'products') {
        if (isNew) setServices(p => [...p, data]);
        else setServices(p => p.map(i => i.id === data.id ? data : i));
        setServiceModalVisible(false);
      } else if (type === 'clients') {
        if (isNew) setClients(p => [...p, data]);
        else setClients(p => p.map(i => i.id === data.id ? data : i));
        setClientModalVisible(false);
      } else if (type === 'reviews') {
        setReviews(p => p.map(i => i.id === data.id ? data : i));
        setReviewModalVisible(false);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Вы уверены, что хотите удалить этот элемент?`)) return;
    const endpoint = `/${type}`;
    try {
      await api.delete(`${endpoint}/${id}`);
      if (type === 'products') {
        setServices(prev => prev.filter(s => s.id !== id));
      } else if (type === 'clients') {
        setClients(prev => prev.filter(c => c.id !== id));
      } else if (type === 'reviews') {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const openAddModal = () => {
    if (activeTab === 'services') {
        setEditingService(null); setServiceModalVisible(true);
    } else if (activeTab === 'clients') {
        setEditingClient(null); setClientModalVisible(true);
    }
  };

  const openEditModal = (item, type) => {
    if (type === 'services') {
        setEditingService(item); setServiceModalVisible(true);
    } else if (type === 'clients') {
        setEditingClient(item); setClientModalVisible(true);
    } else if (type === 'reviews') {
        setEditingReview(item); setReviewModalVisible(true);
    }
  };

  if (isLoading) return <div className="admin-loading">Загрузка...</div>;

  // Рендеринг сеток
  const servicesGrid = (
    <div className="items-grid">
      {services.map(service => (
        <div key={service.id} className="item-card">
          <div className="card-header"><h3>{service.name}</h3><span className="item-price">{service.price} ₽</span></div>
          <p className="item-description">{service.description}</p>
          <div className="card-actions">
            <button onClick={() => openEditModal(service, 'products')} className="btn-icon"><FiEdit /></button>
            <button onClick={() => handleDelete(service.id, 'products')} className="btn-icon btn-danger"><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const clientsGrid = (
    <div className="items-grid">
      {clients.map(client => (
        <div key={client.id} className="item-card">
          <div className="card-header">
            <h3>{client.name}</h3>
            <span className="item-car"><FiTruck style={{ marginRight: '8px'}} />{client.car}</span>
          </div>
          <p className="item-phone"><FiPhone style={{ marginRight: '8px'}} />{client.phone}</p>
          <div className="card-actions">
            <button onClick={() => openEditModal(client, 'clients')} className="btn-icon"><FiEdit /></button>
            <button onClick={() => handleDelete(client.id, 'clients')} className="btn-icon btn-danger"><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const reviewsGrid = (
    <div className="items-grid">
        {reviews.map(review => (
            <div key={review.id} className="item-card review-card-admin">
                <div className="card-header">
                    <h3>{review.name}</h3>
                    <span className="item-rating">{Array(review.rating).fill('★').join('')}</span>
                </div>
                <p className="item-description">{review.text}</p>
                <small className="review-date-admin">{new Date(review.created_at).toLocaleDateString()}</small>
                <div className="card-actions">
                    <button onClick={() => openEditModal(review, 'reviews')} className="btn-icon"><FiEdit /></button>
                    <button onClick={() => handleDelete(review.id, 'reviews')} className="btn-icon btn-danger"><FiTrash2 /></button>
                </div>
            </div>
        ))}
    </div>
  );


  return (
    <div className="admin-panel-fullscreen">
      <header className="admin-panel-header">
        <div className="admin-panel-tabs">
          <button onClick={() => setActiveTab('services')} className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}><FiTool style={{marginRight: '8px'}}/> Услуги</button>
          <button onClick={() => setActiveTab('clients')} className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}><FiUsers style={{marginRight: '8px'}}/> Клиенты</button>
          <button onClick={() => setActiveTab('reviews')} className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}><FiStar style={{marginRight: '8px'}}/> Отзывы</button>
        </div>
        <div className="admin-header-actions">
          {activeTab !== 'reviews' && (
            <button onClick={openAddModal} className="add-item-btn"><FiPlusCircle style={{marginRight: '8px'}}/> Добавить {activeTab === 'services' ? 'услугу' : 'клиента'}</button>
          )}
          <button onClick={handleLogout} className="admin-logout-btn"><FiLogOut style={{marginRight: '8px'}}/> Выйти</button>
        </div>
      </header>

      <main>
        {activeTab === 'services' && servicesGrid}
        {activeTab === 'clients' && clientsGrid}
        {activeTab === 'reviews' && reviewsGrid}
        {(activeTab === 'services' && services.length === 0) && <div className="empty-state">Услуги пока не добавлены.</div>}
        {(activeTab === 'clients' && clients.length === 0) && <div className="empty-state">Клиенты пока не добавлены.</div>}
        {(activeTab === 'reviews' && reviews.length === 0) && <div className="empty-state">Отзывы пока не добавлены.</div>}
      </main>

      <ServiceModal isVisible={isServiceModalVisible} service={editingService} onSave={(item) => handleSave(item, 'products')} onClose={() => setServiceModalVisible(false)} />
      <ClientModal isVisible={isClientModalVisible} client={editingClient} onSave={(item) => handleSave(item, 'clients')} onClose={() => setClientModalVisible(false)} />
      <ReviewModal isVisible={isReviewModalVisible} review={editingReview} onSave={(item) => handleSave(item, 'reviews')} onClose={() => setReviewModalVisible(false)} />
    </div>
  );
};

export default AdminPanel;
