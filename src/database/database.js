const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'messages.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the messages database.');
});

db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const saveMessage = (userId, message) => {
    db.run(`INSERT INTO messages (user_id, message) VALUES (?, ?)`, [userId, message], (err) => {
        if (err) {
            console.log('Ошибка при сохранении сообщения:', err.message);
        }
    });
};

const getMessages = (userId, callback) => {
    db.all(`SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp DESC`, [userId], (err, rows) => {
        if (err) {
            console.log('Ошибка при получении сообщений:', err.message);
            return callback([]);
        }
        callback(rows);
    });
};

const getAllUsersMessages = (callback) => {
    db.all(`SELECT * FROM messages ORDER BY timestamp DESC`, (err, rows) => {
        if (err) {
            console.error('Ошибка при получении всех сообщений от пользователей:', err.message);
            return callback([]);
        }
        callback(rows);
    });
};

module.exports = {
    saveMessage,
    getMessages,
    getAllUsersMessages
};