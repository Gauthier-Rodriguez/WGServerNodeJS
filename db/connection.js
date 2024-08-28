import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.ATLAS_URI || '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();

    // Ensure that the connection is successful by pinging the database
    await client.db('admin').command({ ping: 1 });
    console.log('Connected successfully to server');

    // Return the database object
    return client.db('wgdb');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.stack);
    process.exit(1); // Exit the process with failure
  }
}

// Call the function to connect and export the database
const db = await connectToDatabase();

export default db;
