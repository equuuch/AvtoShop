const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost', 
    port: 3307,
    user: 'root',      
    password: 'root',      
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
