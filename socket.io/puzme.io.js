/**
 * Puzme
 */
module.exports = (io) => {
  var puzme = io.of('/puzme'),
    waiter = null

  puzme.on('connection', (socket) => {
    console.log('1 puzme connected')

    socket.on('join', (id) => {
      // Check waiter
      if (waiter == null) {
        waiter = socket;
      } else {
        // Start Match
        var player1 = waiter,
          player2 = socket

        player1.emit('start', id);
        player2.emit('start', id);

        player1.on('data', (data) => {
          player1.to(player2.id).emit('data', data);
        })

        player2.on('data', (data) => {
          player2.to(player1.id).emit('data', data);
        })

        player1.on('disconnect', () => {
          //
        })

        player2.on('disconnect', () => {
          //
        })


      }
    })

    socket.on('message', data => {
      console.log(data)
    })
    socket.on('disconnect', () => {
      if (waiter == socket) waiter = null
      console.log('1 puzme disconnected')
    })
  })
}
