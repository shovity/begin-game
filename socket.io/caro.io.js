/**
 * Caro
 */
module.exports = (io) => {
  //
  var caro = io.of('/games/caro');
  // On player connection
  caro.on('connection', (socket) => {

      socket.on('findMatch', onFindMatch);

      socket.on('cancelFindMatch', function () {
      	if (socket == waiter) waiter = null;
          updateDataBroadcast(socket);
      });

      function onFindMatch() {
      	if (waiter == null) {
          	waiter = socket;
          	updateDataBroadcast(socket);
      	} else {
  			beginMatch();
      	}

      	function beginMatch() {
      		var x = socket;
      		var o = waiter;
      		waiter = null;
      		updateDataBroadcast(socket);

      		// Send start
      		x.emit('start match', {team: 'x'});
      		x.to(o.id).emit('start match', {team: 'o'});

      		// On x hit
      		x.on('hit', onXHit);

      		// On o hit
      		o.on('hit', onOHit);

      		// On X win
      		x.on('iwin', clearOn);

      		// On o win
      		o.on('iwin', clearOn);

      		// On x disconnect
      		x.on('disconnect', onXDisconnect);

     			// On o disconnect
      		o.on('disconnect', onODisconnect);

      		function onXDisconnect() {
      			x.to(o.id).emit('enemy outed');
      			clearOn();
      		}

      		function onODisconnect() {
      			x.emit('enemy outed');
      			clearOn();
      		}

      		function onXHit(data) {
      			x.to(o.id).emit('hit', {team: 'x', x: data.x, y: data.y});
      		}

      		function onOHit(data) {
      			x.emit('hit', {team: 'o', x: data.x, y:data.y});
      		}

      		function clearOn() {
  	    		x.removeAllListeners('hit', onXHit);
  	    		o.removeAllListeners('hit', onOHit);
  	    		x.removeAllListeners('iwin', clearOn);
  	    		o.removeAllListeners('iwin', clearOn);
  	    		x.removeAllListeners('disconnect', onXDisconnect);
  	    		o.removeAllListeners('disconnect', onODisconnect);
      		}
      	}
      }
  });
}
