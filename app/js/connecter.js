const io = require('socket.io-client')

const connect = (uid, game, callback) => {
  var socket = io(game);

  socket.emit('join', uid)
  socket.on('start', (uid) => {
    console.log('start with ' + uid);
  })
}

module.exports = { connect }
