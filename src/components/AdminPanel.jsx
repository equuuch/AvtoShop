import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPanel.css';
import { FiUsers, FiEdit, FiTrash2, FiPlusCircle, FiTool, FiLogOut, FiPhone, FiTruck, FiStar, FiSearch } from 'react-icons/fi';

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
    const valueToSet = name === 'rating' ? Math.max(1, Math.min(5, Number(value))) : value;
    setEdited(prev => ({ ...prev, [name]: valueToSet }));
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

const SearchBar = ({ searchQuery, setSearchQuery, activeTab }) => {
    const placeholders = {
        services: "Поиск по названию или описанию...",
        clients: "Поиск по ФИО, телефону или авто...",
        reviews: "Поиск по имени или тексту отзыва..."
    };
    return (
        <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
                type="text"
                className="search-input"
                placeholder={placeholders[activeTab]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
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
  const [searchQuery, setSearchQuery] = useState('');
  
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
      const [servicesRes, clientsRes, reviewsRes] = await Promise.all([
          api.get('/products').catch(e => { console.error('Error fetching services:', e); return { data: [] }; }),
          api.get('/clients').catch(e => { console.error('Error fetching clients:', e); return { data: [] }; }),
          api.get('/reviews').catch(e => { console.error('Error fetching reviews:', e); return { data: [] }; })
      ]);
      setServices(servicesRes.data.sort((a, b) => a.id - b.id));
      setClients(clientsRes.data.sort((a, b) => a.id - b.id));
      setReviews(reviewsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
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
    // ВАЖНО: Используем 'products' для API услуг
    const apiType = type === 'services' ? 'products' : type;
    const endpoint = `/${apiType}`;
    const method = isNew ? 'post' : 'put';
    const url = isNew ? endpoint : `${endpoint}/${item.id}`;

    try {
      const { data } = await api[method](url, item);
      await fetchData(); // Перезагружаем все данные для консистентности

      if (type === 'services') setServiceModalVisible(false);
      else if (type === 'clients') setClientModalVisible(false);
      else if (type === 'reviews') setReviewModalVisible(false);

    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Вы уверены, что хотите удалить этот элемент?`)) return;
    // ВАЖНО: Используем 'products' для API услуг
    const apiType = type === 'services' ? 'products' : type;
    const endpoint = `/${apiType}`;
    try {
      await api.delete(`${endpoint}/${id}`);
      await fetchData(); // Перезагружаем все данные
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

  // --- Логика фильтрации ---
  const filteredServices = useMemo(() =>
    services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [services, searchQuery]);

  const filteredClients = useMemo(() =>
    clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.car.toLowerCase().includes(searchQuery.toLowerCase())
    ), [clients, searchQuery]);
    
  const filteredReviews = useMemo(() =>
    reviews.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase())
    ), [reviews, searchQuery]);


  if (isLoading) return <div className="admin-loading">Загрузка...</div>;

  // --- Рендеринг сеток ---
  const renderGrid = (items, type, gridComponent) => {
      const originalCount = type === 'services' ? services.length : type === 'clients' ? clients.length : reviews.length;
      if (originalCount === 0) {
          return <div className="empty-state">{type === 'services' ? 'Услуги' : type === 'clients' ? 'Клиенты' : 'Отзывы'} пока не добавлены.</div>;
      }
      if (items.length === 0) {
          return <div className="empty-state">По вашему запросу ничего не найдено.</div>;
      }
      return gridComponent(items);
  };

  const servicesGrid = (items) => (
    <div className="items-grid">
      {items.map(service => (
        <div key={service.id} className="item-card">
          <div className="card-header"><h3>{service.name}</h3><span className="item-price">{service.price} ₽</span></div>
          <p className="item-description">{service.description}</p>
          <div className="card-actions">
            <button onClick={() => openEditModal(service, 'services')} className="btn-icon"><FiEdit /></button>
            <button onClick={() => handleDelete(service.id, 'services')} className="btn-icon btn-danger"><FiTrash2 /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const clientsGrid = (items) => (
    <div className="items-grid">
      {items.map(client => (
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

  const reviewsGrid = (items) => (
    <div className="items-grid">
        {items.map(review => (
            <div key={review.id} className="item-card review-card-admin">
                <div className="card-header">
                    <h3>{review.name}</h3>
                    <span className="item-rating">{Array(Math.round(review.rating) || 1).fill('★').join('')}</span>
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
          <button onClick={() => { setActiveTab('services'); setSearchQuery(''); }} className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}><FiTool style={{marginRight: '8px'}}/> Услуги</button>
          <button onClick={() => { setActiveTab('clients'); setSearchQuery(''); }} className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}><FiUsers style={{marginRight: '8px'}}/> Клиенты</button>
          <button onClick={() => { setActiveTab('reviews'); setSearchQuery(''); }} className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}><FiStar style={{marginRight: '8px'}}/> Отзывы</button>
        </div>
        <div className="admin-header-actions">
          {activeTab !== 'reviews' && (
            <button onClick={openAddModal} className="add-item-btn"><FiPlusCircle style={{marginRight: '8px'}}/> Добавить {activeTab === 'services' ? 'услугу' : 'клиента'}</button>
          )}
          <button onClick={handleLogout} className="admin-logout-btn"><FiLogOut style={{marginRight: '8px'}}/> Выйти</button>
        </div>
      </header>
      
      <div className="admin-panel-subheader">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeTab={activeTab} />
      </div>

      <main>
        {activeTab === 'services' && renderGrid(filteredServices, 'services', servicesGrid)}
        {activeTab === 'clients' && renderGrid(filteredClients, 'clients', clientsGrid)}
        {activeTab === 'reviews' && renderGrid(filteredReviews, 'reviews', reviewsGrid)}
      </main>

      <ServiceModal isVisible={isServiceModalVisible} service={editingService} onSave={(item) => handleSave(item, 'services')} onClose={() => setServiceModalVisible(false)} />
      <ClientModal isVisible={isClientModalVisible} client={editingClient} onSave={(item) => handleSave(item, 'clients')} onClose={() => setClientModalVisible(false)} />
      <ReviewModal isVisible={isReviewModalVisible} review={editingReview} onSave={(item) => handleSave(item, 'reviews')} onClose={() => setReviewModalVisible(false)} />
    </div>
  );
};

export default AdminPanel;
