const schedule = require('node-schedule')
const trello = require('./trello')
const path = process.env.DATA_PATH

console.log(path)

if (!path) {
  console.error('No DATA_PATH specified')
  process.exit(1)
}

schedule.scheduleJob('42 * * * *', function () {
  trello.retrieve(path).then((params) => {
    console.log('trello trieved successfully')
  }).catch((err) => {
    console.error('trello save file failed', err)
  })
})
