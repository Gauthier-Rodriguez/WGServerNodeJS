import express from 'express';
import Room from '../db/models.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.send('test route works!');
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const results = await Room.find({});
    res.status(200).send(results);
  } catch (err) {
    console.error('Error occurred:', err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get available rooms (where currentOccupants < 2)
router.get('/available', async (req, res) => {
  try {
    const results = await Room.find({ currentOccupants: { $lt: 2 } });
    if (results.length === 0) {
      return res.status(404).send({ message: "No rooms found with fewer than 2 occupants" });
    }
    res.status(200).send(results.map(room => room.roomNumber));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Get a specific room by roomNumber
router.get('/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id, 10);
    const room = await Room.collection.findOne({ roomNumber: roomNumber });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    res.status(200).send(room);
  } catch (err) {
    console.error('Error during query:', err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Join a room
router.put('/join/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id);
    const name = req.body.name;
    const room = await Room.findOne({ roomNumber: roomNumber });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    if (room.currentOccupants >= room.maxOccupants) {
      return res.status(400).send({ message: 'Room is full' });
    }
    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber: roomNumber },
      { $push: { occupants: { name: name } }, $inc: { currentOccupants: 1 } },
      { new: true }
    );
    res.status(200).send(updatedRoom);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Leave a room
router.put('/leave/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id);
    const name = req.body.name;
    const room = await Room.findOne({ roomNumber: roomNumber });
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    const occupantExists = room.occupants.some(occupant => occupant.name === name);
    if (!occupantExists) {
      return res.status(400).send({ message: 'Occupant not found in this room' });
    }
    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber: roomNumber },
      { $pull: { occupants: { name: name } }, $inc: { currentOccupants: -1 } },
      { new: true }
    );
    res.status(200).send(updatedRoom);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

export default router;
