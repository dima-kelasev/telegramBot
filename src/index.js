require('dotenv').config();
const {bot} = require('./bot');

bot.launch({ allowedUpdates: [ "message", "message_reaction", "command" ] });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));