const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in .env');
    process.exit(1);
}

const bot = new TelegramBot(token);
const webAppUrl = 'https://web-app-debugging.netlify.app';

// УБЕРИТЕ ОБРАБОТЧИК СОБЫТИЙ "message" И "polling_error" ОТСЮДА!
// Они больше не нужны, когда вы используете webhook.
// Все сообщения будут поступать через POST-запросы на ваш сервер Express.

// Экспортируйте только bot
module.exports = bot;