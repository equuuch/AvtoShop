import React, { useState } from 'react';
import '../styles/Services.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  
  const services = [
    {
      id: 1,
      name: 'Техническое обслуживание',
      description: 'Компьютерная диагностика двигателя, ходовой части, электрики',
      price: 'от 500 ₽'
    },
    {
      id: 2,
      name: 'Диагностика',
      description: 'Замена амортизаторов, сайлентблоков, шаровых опор, ступиц',
      price: 'от 1000 ₽'
    },
    {
      id: 3,
      name: 'Чип-тюнинг',
      description: 'Замена масла в двигателе и фильтров, трансмиссионное масло',
      price: 'от 500 ₽'
    },
    {
      id: 4,
      name: 'Замена масла',
      description: 'Механика и автомат, замена сцепления, ремонт коробки передач',
      price: 'от 2000 ₽'
    }
  ];

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
          {services.map((service) => (
            <div
              key={service.id}
              className="service__card"
              onClick={() => handleCardClick(service)}
            >
              <h3 className="service__name">{service.name}</h3>
              
              {selectedService === service && (
                <div className="service__details">
                  <p><strong>Описание:</strong> {service.description}</p>
                  <p><strong>Цена:</strong> {service.price}</p>
                </div>
              )}
              
              <button 
                className="service__btn"
                onClick={(e) => handleBooking(e, service.name)}
              >
                Записаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;