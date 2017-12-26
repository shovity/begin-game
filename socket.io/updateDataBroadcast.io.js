/**
 * Update data to all client
 * @param  {object} io socket.io instance
 */
module.exports = (io) => {
    io.nsps['/'].emit('update data', { users: io.users });
    io.nsps['/games/caro'].emit('update data', { users: io.users });
    // io.nsps['/games/plane'].emit('update data', { users: io.users });
    // io.nsps['/games/au4k'].emit('update data', { users: io.users });
}
