import mongoose from 'mongoose';

console.log('Script is running...');

const uri = process.env.ATLAS_URI || '';
console.log('MongoDB URI:', uri);

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.stack);
    process.exit(1);
  }

  console.log('Connected successfully to MongoDB using Mongoose');
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', uri);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

connectToDatabase();

export default mongoose;
