const { Telegraf } = require('telegraf');
const { getSmile } = require('./helper/get-smile');
const { getSmileForWind } = require('./helper/get-smile-for-wind');
const axios = require('axios');
const { getMessages, getAllUsersMessages, saveMessage } = require('./database/database')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}! Вот что я умею:\n` +
              `\n✨ <b>Команды:</b>\n` +
              `🔧 /help - получить список доступных команд\n` +
              `📥 /getMyMessages - получить свои сохраненные сообщения\n` +
              `🌍 /getAllUsersMessages - получить все сообщения от всех пользователей\n` +
              `📍 Отправь мне свою геолокацию, и я скажу, какая у тебя погода\n` +
              `💬 Можешь отправить мне стикер, я отвечу тебе\n` +
              `👋 Просто напиши "Привет" или спроси, как у меня дела!`, 
              { parse_mode: 'HTML' });
});

bot.help((ctx) => {
    ctx.reply(`Вот список команд, которые ты можешь использовать:\n` +
              `- /help - получить список доступных команд\n` +
              `- /getMyMessages - получить свои сохраненные сообщения\n` +
              `- /getAllUsersMessages - получить все сообщения от всех пользователей\n` +
              `- Отправь мне свою геолокацию, и я скажу, какая у тебя погода\n` +
              `- Можешь отправить мне стикер, я отвечу тебе\n` +
              `- Просто напиши "Привет" или спроси, как у меня дела!`);
});
bot.on('sticker', (ctx) => ctx.reply('на тебе 👅'));
bot.hears('Привет', (ctx) => ctx.reply('привет привет а выпить нет'));
bot.hears('Как дела?', (ctx) => ctx.reply('Я бот, по-этому дел нет'));

bot.command('getMyMessages', (ctx) => {
    const userId = ctx.message.from.id; 
    getMessages(userId, (messages) => {
        if (messages.length === 0) {
            return ctx.reply('Нет сохраненных сообщений.');
        }
        const formattedMessages = messages.map((msg) => `Сообщение: ${msg.message}\nВремя: ${msg.timestamp}`).join('\n\n');
        ctx.reply(formattedMessages);
    });
});

bot.command('getAllUsersMessages', (ctx) => {
    const userId = ctx.message.from.id; 
    console.log('ctx',ctx)
    getAllUsersMessages( (messages) => {
        if (messages.length === 0) {
            return ctx.reply('Нет сохраненных сообщений.');
        }
        console.log('messages',messages)
        const formattedMessages = messages.map((msg) => `${userId === msg.user_id ? 'Мои сообщения:': 'Чужие сообщения:'} ${msg.message}\nВремя: ${msg.timestamp}`).join('\n\n');
        ctx.reply(formattedMessages);
    });
});


bot.on('message', async (ctx) => {
    if (ctx.message.location) {
        const headers = {
            'X-Yandex-Weather-Key': process.env.YANDEX_API_KEY
        };
        const yandexWeather = `https://api.weather.yandex.ru/v2/forecast?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}`;
        const yandexResponse = await axios.get(yandexWeather, { headers });
        const { temp, feels_like, wind_speed } = yandexResponse.data.fact;


        ctx.reply(`За бортом сейчас  - ${temp} ${getSmile(temp)}\n` +
                  `Ощущается как - ${feels_like} ${getSmile(feels_like)}\n` +
                  `Скорость ветра - ${wind_speed} ${getSmileForWind(wind_speed)}`);
    } else if (ctx.message.text) {
        saveMessage(ctx.message.from.id, ctx.message.text);
    }
});



module.exports = { bot };


