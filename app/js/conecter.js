const connect = (id, ns, callback) => {
  var socket = require('socket.io-client')(ns);
  socket.emit('join', id)

  socket.on('start', (id) => {
    socket.emit('data', data)
    socket.on('data', (data) => {
      //
    })
  })
}

module.exports = { connect }
