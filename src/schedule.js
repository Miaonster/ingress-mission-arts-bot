const schedule = require('node-schedule')
const trello = require('./trello')
const path = process.env.DATA_PATH

if (!path) {
  console.error('No DATA_PATH specified')
  process.exit(1)
}

schedule.scheduleJob('* * */3 * * *', function () {
  trello.trieve(path)
  console.log('trello trieved successfully')
})
