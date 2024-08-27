import rooms from './routes/room.js';
import express from 'express';
import {createServer} from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});
app.use(cors());
app.use(express.json());


app.use(cors());
app.use(express.json());
app.use("/rooms", rooms);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
} );

server.listen(port, () => {
  console.log(`Server is running at  http://localhost:${port}`);
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