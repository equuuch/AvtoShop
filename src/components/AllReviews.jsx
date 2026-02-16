import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Testimonials.css'; // Assuming styles are in Testimonials.css

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                setReviews(response.data);
            } catch (err) {
                setError('Не удалось загрузить отзывы. Попробуйте снова позже.');
                console.error('Ошибка при загрузке отзывов:', err);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="all-reviews-container">
            <h1 className="all-reviews-title">Все отзывы</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <h3 className="review-author">{review.name}</h3>
                                <div className="review-rating">
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                            <p className="review-text">{review.text}</p>
                            <p className="review-date">
                                {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Отзывов пока нет.</p>
                )}
            </div>
        </div>
    );
};

export default AllReviews;
