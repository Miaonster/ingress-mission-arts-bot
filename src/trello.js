const fs = require('fs')
const fetch = require('node-fetch')
// const url = 'https://reqres.in/api/users'

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

async function retrieve (dataPath) {
  const cardsUrl = 'https://api.trello.com/1/boards/LvwOjrYP/cards?filter=open&attachments=cover'
  const closedListsUrl = 'https://api.trello.com/1/boards/LvwOjrYP/lists/closed'
  const closedLists = await fetch(closedListsUrl).then(checkStatus).then(parseJSON)
  const map = closedLists.reduce((a, b) => Object.assign({ [b.id]: true }, a), {})
  const cards = await fetch(cardsUrl).then(checkStatus).then(parseJSON)
  const data = cards.filter((x) => !map[x.idList])

  fs.writeFile(dataPath, JSON.stringify(data), function (err) {
    if (err) {
      console.error('wirteFile error', err)
    }
  })
}

module.exports = {
  retrieve,
}
