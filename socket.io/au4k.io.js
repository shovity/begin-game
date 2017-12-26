/**
 * Au 4k
 */
module.exports = (io) => {
  var au4k = io.of('/au4k'),
    waiter = null

  au4k.on('connection', (socket) => {
    console.log('1 au4k connected')

    // Check waiter
    if (waiter == null) {
      waiter = socket;
    } else {
      // Start Match
      var player1 = waiter,
        player2 = socket
        
      waiter = null

      player1.send('start game, you are player 1');
      player2.send('start game, you are player 2');
    }

    socket.on('message', data => {
      console.log(data)
    })
    socket.on('disconnect', () => {
      if (waiter == socket) waiter = null
      console.log('1 au4k disconnected')
    })
  })
}
