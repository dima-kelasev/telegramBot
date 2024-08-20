require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getSmile } = require('./helper/get-smile')
const { getSmileForWind } = require('./helper/get-smile-for-wind')
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply('Привет! Тут будут простые команды, что со мной можно делать:\n' +
              '- /help\n' +
              '- Можешь поздороваться, отправив мне "Привет"\n' +
              '- Или спросить, как у меня - Как дела?\n' + 
              '- Отправь мне свою геолокацию и я скажу какая у тебя погода\n' + 
              '- Можешь отправить мне стикер');
});
bot.help((ctx) => ctx.reply('Отправь мне стикер пожалуйста'));
bot.on('sticker', (ctx) => ctx.reply('на тебе 👅'));
bot.hears('Привет', (ctx) => ctx.reply('привет привет а выпить нет'));
bot.hears('Как дела?', (ctx) => ctx.reply('Я бот, по-этому дел нет'));
bot.on ('message', async (ctx) => {
  if(ctx.message.location) {

    const headers = {
      'X-Yandex-Weather-Key': process.env.YANDEX_API_KEY
  };
  const yandexWeather = `https://api.weather.yandex.ru/v2/forecast?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}`
    // const weatherAPIUrl = `https://openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=${process.env.WEATHER_API_KEY}`;
    const yandexResponse = await axios.get(yandexWeather, {headers});
    const { temp, feels_like, wind_speed } = yandexResponse.data.fact

    ctx.reply(`За бортом сейчас  - ${temp} ${getSmile(temp)}\n` +
              `Ощущается как - ${feels_like} ${getSmile(feels_like)}\n` + 
              `Скорость ветра - ${wind_speed} ${getSmileForWind(wind_speed)}`);
  }
  } )

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));