const TelegramBot = require('node-telegram-bot-api')
const handle = require('./handle')

const token = process.env.TOKEN

if (!token) {
  console.error('No Token')
  process.exit(1)
}

const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/q (.+)/, (msg, match) => {
  handle({ msg, match, bot, id: msg.chat.id })
})

bot.onText(/\/q@ingress_misssion_arts_bot/, (msg, match) => {
  bot.sendMessage(msg.chat.id, '查询任务格式为: /q 任务名')
})

console.log('start')
