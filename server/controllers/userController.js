const pool = require('../config/db');

// Регистрация (добавление админа)
exports.registerAdmin = async (req, res) => {
    const { name_user, password_user, email } = req.body;

    try {
        const query = `INSERT INTO users (name_user, password_user, email) VALUES (?, ?, ?)`;
        await pool.query(query, [name_user, password_user, email]);

        res.json({ success: true, message: 'Администратор создан' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Вход (просто проверка логина и пароля)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Найти пользователя по email
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Пользователь не найден' 
            });
        }

        const user = users[0];
        
        // 2. Проверить пароль (без хеширования)
        if (password !== user.password_user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Неверный пароль' 
            });
        }

        // 3. Успешная авторизация
        res.json({
            success: true,
            message: 'Авторизация успешна',
            user: {
                id: user.id_user,
                name: user.name_user,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Ошибка сервера' 
        });
    }
};