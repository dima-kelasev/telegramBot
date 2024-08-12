require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('Привет! Тут будут простые команды, что со мной можно делать:\n' +
              '- /help\n' +
              '- Можешь поздороваться, отправив мне "Привет"\n' +
              '- Или спросить, как у меня дела\n' +
              '- Можешь отправить мне стикер');
});
bot.help((ctx) => ctx.reply('Отправь мне стикер пожалуйста'));
bot.on('sticker', (ctx) => ctx.reply('на тебе 👅'));
bot.hears('Привет', (ctx) => ctx.reply('привет привет а выпить нет'));
bot.hears('Как дела?', (ctx) => ctx.reply('Я бот, поэтому дел нет'));
bot.on ('message',(ctx) => {
    console.log('ctx.message.location', ctx.message);
  } )
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));