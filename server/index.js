const express = require('express');
const dotenv = require('dotenv')
const { Pool } = require('pg');
const cors = require('cors');
const bot = require('./telegram-test-bot')
const fs = require('fs');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    return res.json({ message: 'backend zaebis class' });
});
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    console.log('Получен POST-запрос от Telegram:', req.body); //  Добавляем логирование
    bot.processUpdate(req.body);
    res.sendStatus(200);
});


// //  Функция для чтения данных из user_statuses.json
// const readUserStatuses = () => {
//     try {
//         const data = fs.readFileSync('user_statuses.json', 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error('Ошибка чтения файла user_statuses.json:', err);
//         return {}; //  Возвращаем пустой объект, если файл не существует или поврежден
//     }
// };

//  Функция для записи данных в user_statuses.json
// const writeUserStatuses = (data) => {
//     try {
//         fs.writeFileSync('user_statuses.json', JSON.stringify(data, null, 2), 'utf8');
//     } catch (err) {
//         console.error('Ошибка записи в файл user_statuses.json:', err);
//     }
// };


// //  API для получения статусов опросов пользователя
// app.get('/api/user-statuses/:userId', (req, res) => {
//     const userId = req.params.userId;
//     const userStatuses = readUserStatuses();
//     //  Возвращаем статусы для конкретного пользователя или пустой объект, если пользователя нет
//     res.json(userStatuses[userId] || {});
// });


// //  API для обновления статуса опроса пользователя
// app.post('/api/user-statuses/:userId', (req, res) => {
//     const userId = req.params.userId;
//     const { formId, status } = req.body;

//     const userStatuses = readUserStatuses();

//     //  Если пользователя еще нет, создаем запись для него
//     if (!userStatuses[userId]) {
//         userStatuses[userId] = {};
//     }

//     //  Обновляем статус опроса
//     userStatuses[userId][formId] = status;
//     writeUserStatuses(userStatuses);

//     res.json({ message: 'Статус успешно обновлен' });
// });

// app.get('/api/test', (req, res) => {
//     return res.json({ message: 'backend zaebis class' });
// });


//  PostgreSQL Pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false //  позже настроить
    }
});


//  проверка соед. с БД
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err));
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    console.log('Получен POST-запрос от Telegram:', req.body); //  логи
    bot.processUpdate(req.body);
    res.sendStatus(200);
});


//  API для получения статусов опросов пользователя
app.get('/api/user-statuses/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await pool.query(
            'SELECT form_id, status FROM user_statuses WHERE user_id = $1',
            [userId]
        );
        const statuses = {};
        result.rows.forEach(row => {
            statuses[row.form_id] = row.status;
        });
        res.json(statuses);
    } catch (err) {
        console.error('Ошибка получения статусов из БД:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


//  API для обновления статуса опроса пользователя
app.post('/api/user-statuses/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { formId, status } = req.body;

    try {
        //  проверка существования записи пользователя или формы
        const checkResult = await pool.query(
            'SELECT 1 FROM user_statuses WHERE user_id = $1 AND form_id = $2',
            [userId, formId]
        );

        if (checkResult.rows.length > 0) {
            //  если существует обновляем
            await pool.query(
                'UPDATE user_statuses SET status = $3 WHERE user_id = $1 AND form_id = $2',
                [userId, formId, status]
            );
        } else {
            //  если не существует, создаем новую
            await pool.query('INSERT INTO user_statuses (user_id, form_id, status) VALUES ($1, $2, $3)',
                [userId, formId, status]
            );
        }
        res.json({ message: 'Статус успешно обновлен' });
    } catch (err) {
        console.error('Ошибка обновления статуса в БД:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

//  API для сохранения ответов пользователя
app.post('/api/form-responses/:userId/:formId', async (req, res) => {
    const userId = req.params.userId;
    const formId = req.params.formId;
    const responses = req.body;

    try {
        //  обьект ответов в строку json Для хранения
        const responsesJson = JSON.stringify(responses);

        //  проверка существования записи
        const checkResult = await pool.query(
            'SELECT 1 FROM form_responses WHERE user_id = $1 AND form_id = $2',
            [userId, formId]
        );

        if (checkResult.rows.length > 0) {
            //  существует - обновляем
            await pool.query(
                'UPDATE form_responses SET responses = $3 WHERE user_id = $1 AND form_id = $2',
                [userId, formId, responsesJson]
            );
        } else {
            //  не существует - добавляем
            await pool.query(
                'INSERT INTO form_responses (user_id, form_id, responses) VALUES ($1, $2, $3)',
                [userId, formId, responsesJson]
            );
        }

        res.json({ message: 'Ответы успешно сохранены' });
    } catch (err) {
        console.error('Ошибка сохранения ответов в БД:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


// API для получения ответов пользователя
app.get('/api/form-responses/:userId/:formId', async (req, res) => {
    const userId = req.params.userId;
    const formId = req.params.formId;

    try {
        const result = await pool.query(
            'SELECT responses FROM form_responses WHERE user_id = $1 AND form_id = $2',
            [userId, formId]
        );

        if (result.rows.length > 0) {
            //  извлекаем ответы из бд и преобразуем в json
            const responses = JSON.parse(result.rows[0].responses);
            res.json(responses);
        } else {
            //  если нет ответов преобразуем в пустой обьект
            res.json({});
        }
    } catch (err) {
        console.error('Ошибка получения ответов из БД:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


const start = async () => {
    try {
        const webhookUrl = `${process.env.WEB_APP_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}`;
        await bot.setWebHook(webhookUrl);
        console.log('Webhook установлен:', webhookUrl);

        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()