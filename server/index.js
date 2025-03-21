const express = require('express');
const dotenv = require('dotenv')
const { Pool } = require('pg');
const cors = require('cors');
const bot = require('./telegram-test-bot')
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    return res.json({ message: 'backend zaebis class' });
});


//  Функция для чтения данных из user_statuses.json
const readUserStatuses = () => {
    try {
        const data = fs.readFileSync('user_statuses.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла user_statuses.json:', err);
        return {}; //  Возвращаем пустой объект, если файл не существует или поврежден
    }
};

//  Функция для записи данных в user_statuses.json
const writeUserStatuses = (data) => {
    try {
        fs.writeFileSync('user_statuses.json', JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи в файл user_statuses.json:', err);
    }
};


//  API для получения статусов опросов пользователя
app.get('/api/user-statuses/:userId', (req, res) => {
    const userId = req.params.userId;
    const userStatuses = readUserStatuses();
    //  Возвращаем статусы для конкретного пользователя или пустой объект, если пользователя нет
    res.json(userStatuses[userId] || {});
});


//  API для обновления статуса опроса пользователя
app.post('/api/user-statuses/:userId', (req, res) => {
    const userId = req.params.userId;
    const { formId, status } = req.body;

    const userStatuses = readUserStatuses();

    //  Если пользователя еще нет, создаем запись для него
    if (!userStatuses[userId]) {
        userStatuses[userId] = {};
    }

    //  Обновляем статус опроса
    userStatuses[userId][formId] = status;
    writeUserStatuses(userStatuses);

    res.json({ message: 'Статус успешно обновлен' });
});

app.get('/api/test', (req, res) => {
    return res.json({ message: 'backend zaebis class' });
});


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()