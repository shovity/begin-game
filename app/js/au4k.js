const io = require('socket.io-client'),
  matchBox = require('./matchBox')

module.exports = () => {
  matchBox.init();

  var socket = io('/au4k')
  socket.on('message', message => console.log(message))
}
