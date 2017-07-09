const fs = require('fs')
const trello = require('./trello')

class Handler {
  constructor ({ bot, id }) {
    this.bot = bot
    this.id = id
    this.reg = /^\[.*\]( |)/
  }

  sendText (msg, options = {}) {
    const setttins = Object.assign({}, {
      parse_mode: 'Markdown',
      disable_web_page_preview: 'true',
    }, options)

    return this.bot.sendMessage(this.id, msg, setttins)
  }

  sendPhoto (msg) {
    return this.bot.sendPhoto(this.id, msg, { disable_notification: 'false' })
  }

  async getCards () {
    const dataPath = process.env.DATA_PATH || '../ingress-medal-arts.json'

    if (!fs.existsSync(dataPath)) {
      await trello.retrieve(dataPath)
    }

    const plain = fs.readFileSync(dataPath)
    const { cards } = JSON.parse(plain)
    return cards
  }

  filterMissions (title, cards) {
    return cards
      .filter((v) => {
        const name = v.name.toLowerCase()
        if (v.closed) return false
        if (name === title) return true
        if (name.indexOf(title) !== -1) return true
        return false
      })
      .reverse()
      .filter((v, i, self) => {
        const index = self.findIndex((s) => {
          const vname = v.name.replace(this.reg, '')
          const sname = s.name.replace(this.reg, '')
          return vname === sname
        })
        if (index === i) return true
      })
  }

  async handleMulti (missions) {
    const result = []

    result.push('任务已找到，一共有这么多任务，你要看哪一个呢：')

    missions.forEach(({ name }) => {
      result.push(`/q ${name}`)
    })

    await this.sendText(result.join('\n'), { parse_mode: null })
  }

  async sendCoverPhoto (m) {
    if (m.idAttachmentCover) {
      let image

      const attachment = m.attachments.find((attachment) => {
        return attachment.id === m.idAttachmentCover
      })

      if (attachment.previews[4]) {
        image = attachment.previews[4].url
      } else {
        image = attachment.url
      }

      await this.sendPhoto(image)
    }
  }

  handleLinks (name, shortUrl) {
    const links = []
    const aqmhUrl = encodeURI(`http://aqmh.azurewebsites.net/#q=${name}&qt=mosaik`)
    // const mmUrl = encodeURI(`https://ingressmm.com/?find=${name}`)
    // links.push(`[IngressMM](${mmUrl})`)
    links.push(`[Trello](${shortUrl})`)
    links.push(`[AQMH](${aqmhUrl})`)

    return links.join(' | ')
  }

  async handleSingle (missions) {
    const result = []
    const m = missions[0]
    const name = m.name.replace(this.reg, '')
    const links = this.handleLinks(name, m.shortUrl)

    await this.sendText(`任务已找到 ${links}`)
    await this.sendCoverPhoto(m)

    result.push(`${name}`)
    result.push(`${m.desc}`)

    await this.sendText(result.join('\n'), { parse_mode: undefined })
  }

  async handleNull () {
    await this.sendText('很抱歉没有查到你想找的任务信息，要不要换个姿势呢？')
  }

  async handle ({ msg, match }) {
    if (msg.date < (new Date().getTime() / 1000 - 120)) {
      return
    }

    const title = match[1]
    const cards = await this.getCards()
    const missions = this.filterMissions(title, cards)

    let result = []

    if (missions.length > 1) {
      await this.handleMulti(missions)
    } else if (missions.length === 1) {
      await this.handleSingle(missions)
    } else {
      await this.handleNull()
    }

    return result.join('\n')
  }
}

module.exports = async function handle ({ msg, match, bot, id }) {
  const handler = new Handler({ bot, id })

  try {
    await handler.handle({ msg, match })
  } catch (error) {
    await handler.sendText(`哇哦出错了，快召唤 @Miaonster ，错误快照：\n\n\`\`\`\n${error}\n\`\`\``)
    console.error(error)
  }
}
