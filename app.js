const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: '*'
  }
});

users = [];

io.on("connection", (socket) => {

  io.emit('userList', users);
  io.to(socket.id).emit('myId', {
    socketId: socket.id
  });


  socket.on('updateName', (name) => {
    console.log('update name')
    users.unshift({
      name: name,
      sid: socket.id,
      msg: '',
      lastSeen: ''
    });
    socket.user_name = name;
    io.emit('updateUsers', users);
  });

  socket.on('sendMessage', (msg) => {
    const user = users.filter(f => {
      return f.sid == socket.id;
    });
    for (let i = 0; i < users.length; i++) {
      if (users[i].sid == socket.id) {
        users[i].msg = msg;
        users[i].time = now();
      }
    }
    io.emit('updateUsers', users);

    if (user.length) {
      io.emit('incomingMsg', {
        msg: msg,
        username: user[0].name,
        socket: socket.id
      });
    }
  })

  socket.on('disconnect', () => {
    const u = users.filter((f) => {
      return f.sid != socket.id;
    })
    users = u;
    io.emit('userList', u);
  });

});

function now() {
  // 👇️ from CURRENT DATE
  const now = new Date();
  const current = now.getHours() + ':' + now.getMinutes();

// 👇️ With PM / AM
  const withPmAm = now.toLocaleTimeString('en-US', {
    // en-US can be set to 'default' to use user's browser settings
    hour: '2-digit',
    minute: '2-digit',
  });

  return withPmAm;
}

io.listen(3000);
