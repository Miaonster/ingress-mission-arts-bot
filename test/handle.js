import { assert } from 'chai'

import handle from '../src/handle'

describe('handle message', () => {
  let msg = {
    message_id: 52,
    from: {
      id: 70648437,
      first_name: 'Miaonster',
      username: 'Miaonster',
      language_code: 'en-CN',
    },
    chat: {
      id: 70648437,
      first_name: 'Miaonster',
      username: 'Miaonster',
      type: 'private',
    },
    date: 1498993846,
    entities: [{ type: 'bot_command', offset: 0, length: 2 }],
  }

  it('should get mission message', () => {
    msg.text = '/q 访问第二外国语大学'
    const match = msg.text.match(/\/q (.+)/)
    const result = handle(msg, match)
    const expect = 'hehe'
    assert.equal(result, expect)
  })
})
