const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();


const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in .env');
    process.exit(1); // если токен не задан хуйня выходим
};


const bot = new TelegramBot(token);
const webAppUrl = 'https://web-app-debugging.netlify.app';
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(`Received message from chat ${chatId}: ${msg.text}`);
    if(text === '/start') {
        console.log('команда /start');
        await bot.sendMessage(chatId,'ниже появится кнопка', {
            reply_markup: {
                inline_keyboard:[
                    [{ text: 'заполнить', web_app: { url: `${webAppUrl}?user_id=${chatId}` } }],
                ]
            }
        })
    }
    if(text === '/test') {
        console.log('команда /test');
    }
    console.log(`Received message from chat ${chatId}: ${msg.text}`); // логи этой хуеты
});
// обработочка ошибочек
bot.on('polling_error', (error) => {
    console.error('Telegram bot polling error:', error);
});
module.exports = bot;