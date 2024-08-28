import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {let collection = db.collection('rooms');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  }
  catch (err) {
    console.log(err.stack);
  }
});

router.get('/available', async (req, res) => {
  try {
    let collection = db.collection('rooms');
    let results = await collection.find({ currentOccupants: { $lt: 2 } }).toArray();
    if (results.length === 0) {
      return res.status(404).send({ message: "No rooms found with more than 2 occupants" });
    }
    res.status(200).send(results.map(room => room.roomNumber));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id);
    let collection = db.collection('rooms');
    let results = await collection.findOne({ roomNumber: roomNumber });
    console.log(results);
    res.send(results).status(200);
  }
  catch (err) {
    console.log(err.stack);
  }
});

router.put('/join/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id);
    const name = req.body.name;
    let collection = db.collection('rooms');
    const room = await collection.findOne({roomNumber : roomNumber});
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    if (room.currentOccupants >= room.maxOccupants) {
      return res.status(400).send({ message: 'Room is full' });
    }

    const updatedRoom = await collection.findOneAndUpdate(
      { roomNumber : roomNumber },
      { $push: { occupants: {name : name} },
       $inc: { currentOccupants: 1 } },
      { returnDocument: 'after' }
    );
    res.send(updatedRoom).status(200);
    console.log(updatedRoom);
  }
  catch (err) {
    console.log(err.stack);
  }
});

router.put('/leave/:id', async (req, res) => {
  try {
    const roomNumber = parseInt(req.params.id);
    const name = req.body.name;
    let collection = db.collection('rooms');
    const room = await collection.findOne({roomNumber : roomNumber});
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    const occupants = room.occupants.some(occupant => occupant.name === name);
    if (!occupants) {
      return res.status(400).send({ message: 'Occupant not found in this room' });
    }

    const updatedRoom = await collection.findOneAndUpdate(
      { roomNumber : roomNumber },
      { $pull: { occupants: {name : name} },
       $inc: { currentOccupants: -1 } },
      { returnDocument: 'after' }
    );

    res.send(updatedRoom).status(200);
    console.log(updatedRoom);
  }
  catch (err) {
    console.log(err.stack);
  }
});



export default router;