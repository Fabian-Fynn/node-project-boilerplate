import socketio from 'socket.io';

const init = (server) => {
  const io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('send-message', (msg) => {
      io.emit('receive-message', msg);
    });
  });
};

export default init;
