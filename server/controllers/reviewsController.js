const pool = require('../config/db');

// Получение всех отзывов
exports.getAllReviews = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        id,
        name,
        text,
        rating
      FROM testimonials
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Добавление нового отзыва
exports.addReview = async (req, res) => {
  const { name, text, rating } = req.body;
  try {
    const query = `
      INSERT INTO testimonials 
        (name, text, rating) 
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(query, [name, text, rating]);

    res.json({ 
      id: result.insertId, 
      name, 
      text, 
      rating 
    });
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error.message);
    res.status(500).json({ error: error.message });
  }
};
