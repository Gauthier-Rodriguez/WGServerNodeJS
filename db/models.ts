import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true, unique: true },
  maxOccupants: { type: Number, default: 2 },
  currentOccupants: { type: Number, default: 0 },
  occupants: [{ name: String }]
});

const Room = mongoose.model('rooms', roomSchema);
console.log('Room model created');
export default Room;
