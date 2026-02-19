
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        setServices(response.data);
        console.log('Services data fetched successfully:', response.data);
      })
      .catch(error => {
        console.error('Error fetching services data:', error);
      });
  }, []); 

  const handleCardClick = (service) => {
    setSelectedService(service === selectedService ? null : service);
  };

  const handleBooking = (e, serviceName) => {
    e.stopPropagation();
    alert(`Запись на услугу: ${serviceName}`);
  };

  return (
    <section className="services" id="services">
      <div className="services__container">
        <h2 className="services__title">Наши услуги</h2>
        <div className="services__grid">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="service__card"
                onClick={() => handleCardClick(service)}
              >
                <h3 className="service__name">{service.name}</h3>
                
                {selectedService === service && (
                  <div className="service__details">
                    <p><strong>Описание:</strong> {service.description}</p>
                    <p><strong>Цена:</strong> от {service.price} ₽</p>
                  </div>
                )}
                
                <button 
                  className="service__btn"
                  onClick={(e) => handleBooking(e, service.name)}
                >
                  Записаться
                </button>
              </div>
            ))
          ) : (
            <p>Загрузка услуг...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
