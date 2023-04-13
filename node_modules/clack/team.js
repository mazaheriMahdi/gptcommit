var EventEmitter = require('events').EventEmitter
var pify = require('pify')
var request = pify(require('request'), { multiArgs: true })
var WebSocketClient = require('websocket').client
var client = new WebSocketClient()
var blessed = require('blessed')
var moment = require('moment')

module.exports = class Team extends EventEmitter {

  constructor (token) {
    super()
    this.token = token
    this.history = {}
  }

  connect () {
    var url = 'https://slack.com/api/rtm.start'
    var options = { url, method: 'POST', form: { token: this.token }, json: true }
    return request(options).then((result) => {
      var [, state] = result
      let ok = state.ok
      if (!ok) return Promise.reject('Error while connecting') // TODO: more info
      let url = state.url
      this.state = state

      client.on('connectFailed', (error) => {
        client.emit('error', error)
      })

      client.on('connect', (connection) => {
        connection.on('error', (error) => {
          client.emit('error', error)
        })

        connection.on('close', () => {
          client.emit('info', 'Socket closed')
        })

        connection.on('message', (message) => {
          if (message.type === 'utf8') {
            this.emit('log', `rt: ${message.utf8Data}`)
          }
        })

        // connection.sendUTF(number.toString());
      })

      client.connect(url)
    })
  }

  findUser (id) {
    return this.state.users.find((user) => user.id === id)
  }

  findUserName (id, def) {
    var user = this.findUser(id)
    return (user && user.name) || def || id
  }

  findChannel (id) {
    return this.state.channels.find((channel) => channel.id === id)
  }

  findChannelName (id, def) {
    var channel = this.findChannel(id)
    return (channel && channel.name) || def || id
  }

  chatPostMessage (channel, text) {
    var options = {
      url: 'https://slack.com/api/chat.postMessage',
      method: 'POST',
      json: true,
      form: {
        token: this.token,
        channel, text,
        as_user: true
      }
    }
    return request(options).then((result) => {
      var [, body] = result
      var message = body.message
      if (message) {
        message.formattedText = this._parseMessage(message)
        this.emit('message', body)
      }
      this.emit('log', result)
    })
  }

  channelsHistory (id) {
    if (this.history[id]) return Promise.resolve(this.history[id])
    var options = {
      url: 'https://slack.com/api/channels.history',
      method: 'POST',
      json: true,
      form: {
        token: this.token,
        channel: id
      }
    }
    return request(options).then((result) => {
      var [, body] = result
      body.messages.forEach((message) => {
        message.formattedText = this._parseMessage(message)
      })
      this.history[id] = body
      return body
    })
  }

  _parseMessage (message) {
    var type = message.type
    if (type !== 'message') return null
    var text = message.text
    var user = this.findUser(message.user)
    if (!user) {
      this.emit('log', message)
      return null
    }
    var time = moment(+message.ts * 1000).format('HH:mm')
    var formattedText = `${time} {#${user.color}-fg}${user.name}{/} `

    while (true) {
      var start = text.indexOf('<')
      var end = text.indexOf('>')
      if (start === -1 || end === -1) break
      formattedText += blessed.escape(replaceEmojis(text.substring(0, start)))
      var substring = text.substring(start + 1, end)
      var alias = null
      var n = substring.indexOf('|')
      if (n > 0) {
        alias = substring.substring(n + 1)
        substring = substring.substring(0, n)
      }
      text = text.substring(end + 1)
      if (substring.charAt(0) === '@') {
        let id = substring.substring(1)
        let name = alias || this.findUserName(id)
        formattedText += '{#000000-fg}{#FFF2BB-bg}@' + blessed.escape(name) + '{/}'
      } else if (substring.charAt(0) === '#') {
        let id = substring.substring(1)
        let name = alias || this.findChannelName(id)
        formattedText += '{#000000-fg}{#FFF2BB-bg}#' + blessed.escape(name) + '{/}'
      } else if (substring.charAt(0) === '!') {
        var command = substring.substring(1)
        alias = command
        if (command === 'everyone' || command === 'channel' || command === 'group') {
          alias = '@' + command
        }
        formattedText += '{#000000-fg}{#FFF2BB-bg}{bold}' + blessed.escape(alias) + '{/}'
      } else {
        var anchor = alias ? `${alias} <${substring}>` : substring
        formattedText += '{#000000-fg}{#FFF2BB-bg}{bold}' + blessed.escape(anchor) + '{/}'
      }
    }
    formattedText += blessed.escape(replaceEmojis(text))
    return formattedText
  }

}

var emojis = require('./emojis')

function replaceEmojis (str) {
  str = str.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')

  var text = ''
  var i, n
  while (true) {
    i = str.indexOf(':')
    if (i === -1) break
    n = str.indexOf(':', i + 1)
    if (n === -1) break
    var substr = str.substring(i + 1, n)
    var emoji = emojis[substr]
    if (emoji) {
      text += str.substring(0, i)
      text += String.fromCodePoint(parseInt(emoji, 16))
      str = str.substring(n + 1)
    } else {
      text += str.substring(0, n + 1)
      str = str.substring(n + 1)
    }
  }
  text += str
  return text
}
