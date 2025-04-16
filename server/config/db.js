const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root',      
    password: '',      
    database: 'land_db' 
});

pool.getConnection()
  .then((connection) => {
    console.log('ура подключились');
    connection.release();
  })
  .catch((err) => {
    console.error('ошибка подключения:', err);
  });

module.exports = pool;
