/**
 * Plane Socket
 */
planeIO.on('connection', function (socket) {
    users.push(socket.id);
    updateDataBroadcast(socket);

    socket.on('findMatch', onFindMatch);

    socket.on('cancelFindMatch', function () {
        if (socket == waiter) waiter = null;
        updateDataBroadcast(socket);
    });

    socket.on('disconnect', () => {
        // Remove users
        var p = users.indexOf(socket.id);
        if (p > -1) users.splice(p, 1);

        // Remove users from queue if exist
        if (socket == waiter) waiter = null;

        // Update data
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
            x.on('update plane', onXHit);

            // On o hit
            o.on('update plane', onOHit);

            // On x fire
            x.on('fire', onXFire);

            // On x fire
            o.on('fire', onOFire);

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
                x.to(o.id).emit('update plane', data);
            }

            function onOHit(data) {
                x.emit('update plane', data);
            }

            function onXFire(data) {
                x.to(o.id).emit('fire', data);
            }

            function onOFire(data) {
                x.emit('fire', data);
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
