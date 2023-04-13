#!/usr/bin/env node

var path = require('path')
var blessed = require('blessed')
var Team = require('./team')

var screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true,
  log: path.join(__dirname, 'log.txt')
})
screen.title = 'Clack'

const errorHandler = (err) => {
  screen.log(err.stack)
}

var token = process.env.SLACK_TOKEN
if (!token) {
  console.log('You must set up SLACK_TOKEN. Check https://api.slack.com/docs/oauth-test-tokens to create a test token')
  console.log('Then run:')
  console.log('  SLACK_TOKEN=... clack')
  process.exit(1)
}

var selectedChannel
var team = new Team(token)
team.connect()
  .then(() => {
    createUI(team)
  })
  .catch(errorHandler)

team.on('error', errorHandler)
team.on('log', screen.log.bind(screen))

function createUI (team) {
  team.on('message', (body) => {
    var message = body.message
    if (body.channel === selectedChannel) {
      conversation.add(message.formattedText)
    }
  })

  var channels = blessed.list({
    width: '200',
    clickable: true,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: '#f0f0f0'
      },
      scrollbar: {
        bg: 'blue'
      },
      selected: {
        bg: 'red'
      }
    },
    scrollable: true,
    mouse: true,
    tags: true,
    keys: true
  })
  channels.on('select', (data) => {
    textarea.cancel()
    var el = channels.getItem(data.index - 1)
    if (el.get('channel')) {
      selectedChannel = el.get('channel')
      team.channelsHistory(selectedChannel)
        .then((result) => {
          conversation.setContent('')
          result.messages.reverse().forEach((message) => {
            if (message.formattedText) {
              conversation.add(message.formattedText)
            } else {
              screen.log(`No formatted text for message type ${message.type}`)
            }
          })
        })
        .catch(errorHandler)
    } else if (el.get('im')) {
      screen.log('selected thing', el.get('im'), team.findChannel(el.get('im')))
    }
    channels.focus()
  })
  channels.add('CHANNELS')
  team.state.channels.forEach((channel) => {
    if (channel.is_member) {
      var el = channels.add(' #' + channel.name)
      el.set('channel', channel.id)
    }
  })
  channels.add('')
  channels.add('DIRECT MESSAGES')
  team.state.ims.forEach((channel) => {
    if (channel.is_open) {
      var user = team.findUser(channel.user)
      var el = channels.add(' ' + user.name)
      el.set('im', user.id)
    }
  })
  screen.append(channels)

  var conversation = blessed.log({
    left: '200',
    bottom: 4,
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: '#f0f0f0'
      }
    },
    scrollbar: {
      bg: 'blue'
    },
    content: '',
    scrollable: true,
    mouse: true,
    tags: true,
    title: 'pa charrar de alquileres, sean oficinas o casas'
  })
  screen.append(conversation)

  // Quit on Escape, q, or Control-C.
  screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0)
  })

  var textarea = blessed.textbox({
    left: '200',
    bottom: 0,
    height: '80',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: '#f0f0f0'
      }
    },
    scrollbar: {
      bg: 'blue'
    },
    value: 'Hello!\nworld',
    inputOnFocus: true
  })
  screen.append(textarea)
  textarea.on('submit', () => {
    var text = textarea.getValue()
    if (selectedChannel && text) {
      team.chatPostMessage(selectedChannel, text)
        .catch(errorHandler)
    }
    textarea.clearValue()
  })

  // Render the screen.
  screen.render()

  // screen.enableInput(list)
  // screen.enableMouse(list)
  screen.enableInput(textarea)
  screen.enableMouse(textarea)
  // textarea.focus()
}
