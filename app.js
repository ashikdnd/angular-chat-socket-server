const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: '*'
  }
});

users = [];

io.on("connection", (socket) => {
  console.log(socket.id)

  io.emit('userList', users);

  socket.on('updateName', (name) => {
    console.log('update name')
    users.unshift({
      name: name,
      sid: socket.id
    });
    socket.user_name = name;
    io.emit('updateUsers', users);
  });

  socket.on('disconnect', () => {
    const u = users.filter((f) => {
      return f.sid != socket.id;
    })
    users = u;
    io.emit('userList', u);
  });

});

io.listen(3000);