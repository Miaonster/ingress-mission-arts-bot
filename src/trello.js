const url = 'https://trello.com/b/LvwOjrYP/ingress-medal-arts.json'
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

function retrieve (dataPath) {
  fetch(url)
    .then(checkStatus)
    .then(parseJSON)
    .then(function (data) {
      fs.writeFile(dataPath, JSON.stringify(data), function (err) {
        if (err) {
          console.error('wirteFile error', err)
        }
      })
    })
    .catch(function (error) {
      console.error('request failed', error)
    })
}

module.exports = {
  retrieve,
}
