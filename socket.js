'user strict'

var io = require('socket.io')('')

io.on('connection', (socket) => {
  console.log('1 root connected')

  socket.on('disconnect', () => {
    console.log('1 root disconnected')
  })
})

require('./socket.io/au4k.io')(io)
require('./socket.io/puzme.io')(io)

module.exports = io
