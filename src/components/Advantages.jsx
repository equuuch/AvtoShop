import React from 'react';
import '../styles/Advantages.css';

// Импортируем все иконки из папки assets
import qualityIcon from '../assets/качествоработы.svg';
import speedIcon from '../assets/скоростьвыполнения.svg';
import priceIcon from '../assets/достуупныецены.svg';
import masterIcon from '../assets/мастера.svg';

const advantages = [
  { icon: qualityIcon, title: "Качество работы", description: "Высокое качество ремонта и обслуживания автомобилей." },
  { icon: speedIcon, title: "Скорость выполнения", description: "Быстрое и качественное выполнение всех услуг." },
  { icon: priceIcon, title: "Доступные цены", description: "Предлагаем выгодные цены на все виды ремонта и обслуживания." },
  { icon: masterIcon, title: "Профессиональные мастера", description: "Работают только квалифицированные специалисты с опытом." },
];

const Advantages = () => {
  return (
    <section className="advantages" id="advantages">
      <div className="advantages__container">
        <h2 className="advantages__title">Наши Преимущества</h2>
        <div className="advantages__grid">
          {advantages.map((advantage, index) => (
            <div key={index} className="advantage__card">
              <div className="advantage__icon">
                <img src={advantage.icon} alt={advantage.title} />
              </div>
              <h3 className="advantage__title">{advantage.title}</h3>
              <p className="advantage__description">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;