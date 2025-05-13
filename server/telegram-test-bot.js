const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in .env');
    process.exit(1);
}

const bot = new TelegramBot(token); //  No polling!
const webAppUrl = 'https://web-app-debugging.netlify.app';

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(`-> Message received in bot: ${text} from ${chatId}`); // **ОЧЕНЬ ВАЖНО**
    if (text === '/start') {
        console.log('-> /start command processing'); // **ОЧЕНЬ ВАЖНО**
        try {
            await bot.sendMessage(chatId, 'Button below:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Fill', web_app: { url: `${webAppUrl}?user_id=${chatId}` } }],
                    ],
                },
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
});

bot.on('polling_error', (error) => {
    console.error('Polling error (should not happen with Webhooks):', error);
});

module.exports = bot;
