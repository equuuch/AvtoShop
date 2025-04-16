const pool = require('../config/db');

// Получение всех услуг
exports.getAllPosts = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        id_service as id,
        name as name,
        description as description,
        icon as icon,
        price as price
      FROM services
        `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Добавление новой услуги
exports.addPost = async (req, res) => {
  const { name, description, icon, price } = req.body;
  
  try {
    const query = `
      INSERT INTO services 
        (name, description, icon, price) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [name, description, icon, price]);

    res.json({ 
      id_post: result.insertId, 
      name, 
      description, 
      icon, 
      price 
    });
  } catch (error) {
    console.error("Error adding service:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Обновление услуги
exports.updatePost = async (req, res) => {
  const { id_service } = req.params;
  const { name, description, icon, price } = req.body;

  try {
    await pool.query(
      `UPDATE services 
       SET name = ?, description = ?, icon = ?, price = ?
       WHERE id_service = ?`,
      [name, description, icon, price, id_service]
    );
    
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удаление услуги
exports.deletePost = async (req, res) => {
  const { id_service } = req.params;
  
  try {
    const [result] = await pool.query(
      `DELETE FROM services WHERE id_service = ?`, 
      [id_service]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};