const TelegramBot = require('node-telegram-bot-api')
const handle = require('./handle')

// replace the value below with the Telegram token you receive from @BotFather
const token = '400840416:AAFykJxd9mlstQ_ZiCXf4cpZ_2U0RysKISE'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true})

// Matches "/echo [whatever]"
bot.onText(/\/q (.+)/, (msg, match) => {
  handle({ msg, match, bot, id: msg.chat.id })

  // arrs.forEach(({ message, options }) => {
  //   bot.sendMessage(chatId, message, options)
  // })
})

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message')
// });
