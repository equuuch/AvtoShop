import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Testimonials.css';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="star-rating">
      {[5, 4, 3, 2, 1].map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rating"
            value={star}
            checked={rating === star}
            onChange={() => onRatingChange(star)}
          />
          <label htmlFor={`star${star}`}>★</label>
        </React.Fragment>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    text: '',
    rating: 0,
  });
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/reviews')
      .then((response) => {
        setTestimonials(response.data);
      })
      .catch((error) => console.error('Ошибка при загрузке отзывов:', error));
  }, []);

  const handleAddTestimonial = (event) => {
    event.preventDefault();
    if (newTestimonial.name && newTestimonial.text && newTestimonial.rating > 0) {
      axios
        .post('http://localhost:5000/api/reviews', newTestimonial)
        .then((response) => {
          setTestimonials((prev) => [response.data, ...prev]);
          setNewTestimonial({ name: '', text: '', rating: 0 });
          setFormVisible(false);
        })
        .catch((error) => console.error('Ошибка при добавлении отзыва:', error));
    } else {
      alert('Пожалуйста, заполните все поля и выберите рейтинг.');
    }
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__container">
        <h2 className="testimonials__title">Отзывы клиентов</h2>

        <div className="testimonials__grid">
          {testimonials.map((review) => (
            <div key={review.id} className="testimonial__card">
              <div className="testimonial__header">
                <h3 className="testimonial__name">{review.name}</h3>
              </div>
              <p className="testimonial__text">“{review.text}”</p>
              <div className="testimonial__rating">
                {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
            </div>
          ))}
        </div>

        <button className="testimonial__toggle-btn" onClick={() => setFormVisible((v) => !v)}>
          {formVisible ? 'Скрыть форму' : 'Раскрыть форму'}
        </button>

        {formVisible && (
          <form className="testimonial__form animated" onSubmit={handleAddTestimonial}>
            <h3>Оставьте свой отзыв</h3>
            <input
              type="text"
              placeholder="Ваше имя"
              value={newTestimonial.name}
              onChange={(e) =>
                setNewTestimonial({ ...newTestimonial, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Текст отзыва"
              value={newTestimonial.text}
              onChange={(e) =>
                setNewTestimonial({ ...newTestimonial, text: e.target.value })
              }
              required
            />
            <div className="form-group-rating">
              <label>Ваша оценка:</label>
              <StarRating
                rating={newTestimonial.rating}
                onRatingChange={(rating) =>
                  setNewTestimonial({ ...newTestimonial, rating })
                }
              />
            </div>
            <button type="submit">Отправить отзыв</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
