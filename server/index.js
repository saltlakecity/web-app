const express = require('express');
const dotenv = require('dotenv')
const { Pool } = require('pg');
const cors = require('cors');
const bot = require('./telegram-test-bot')
const fs = require('fs');
const { sanitize } = require('dompurify'); //  dompurify от xss
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

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
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
// экранирование спецсимволов
function escapeHtml(string) {
    return string.replace(/[&<>"']/g, function(m) {
        switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#039;';
            default:
                return m;
        }
    });
}

// дээкранирование спецсимволов
function unescapeHtml(string) {
    return string.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {
        switch (m) {
            case '&amp;':
                return '&';
            case '&lt;':
                return '<';
            case '&gt;':
                return '>';
            case '&quot;':
                return '"';
            case '&#039;':
                return "'";
            default:
                return m;
        }
    });
}
//  API для сохранения ответов пользователя
app.post('/api/form-responses/:userId/:formId', async (req, res) => {
    const userId = req.params.userId;
    const formId = req.params.formId;
    let responses = req.body;

    try {
        // санитайзинг данных 
          for (const key in responses) {
              if (responses.hasOwnProperty(key)) {
                  if (typeof responses[key] === 'string') {
                      // экранирование html
                      responses[key] = escapeHtml(responses[key]);
                  }
              }
          }
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
            let responses = JSON.parse(result.rows[0].responses);
              // десанитизация данных из бд
            for (const key in responses) {
                if (responses.hasOwnProperty(key)) {
                    if (typeof responses[key] === 'string') {
                        // восстановление html символов
                        responses[key] = unescapeHtml(responses[key]);
                    }
                }
            }
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
