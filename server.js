const app = require('express')();
const http = require('http').Server(app);
const port = 3000;
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());


const io = new Server(http, {
  cors: {
    origin: '*',
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
} );

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


io.on('connection', (socket) => {
  console.log(`a user connected : ${socket.id}`);
  
  socket.on('joinRoom', (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on('word', (data) => {
    console.log(data);
    socket.to(data.roomNumber).emit('p2_word', data.word);

    socket.on('disconnect', () => {
    console.log(`a user disconnected : ${socket.id}`);
    
  });
  });
 

  });