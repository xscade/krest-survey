import { MongoClient } from 'mongodb';

// Connection URI provided
const uri = "mongodb+srv://xscade_db_user:bxm3aAtoeyjvbBWp@krest-survey.0d8ka06.mongodb.net/?appName=krest-survey";

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to the code');
}

// In production mode, it's best to not use a global variable.
// In development, we use one to preserve the connection across reloads.
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db('krest_dental_db');
    const collection = db.collection('patients');

    if (req.method === 'POST') {
      const data = req.body;
      
      // Add server-side metadata
      const doc = {
        ...data,
        submittedAt: new Date(),
        source: 'vercel-kiosk-app',
        userAgent: req.headers['user-agent'] || 'unknown'
      };

      const result = await collection.insertOne(doc);
      res.status(200).json({ success: true, id: result.insertedId });
    
    } else if (req.method === 'GET') {
      // Fetch all patients, sorted by newest first
      const patients = await collection.find({}).sort({ submittedAt: -1 }).toArray();
      res.status(200).json(patients);
    
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (e) {
    console.error("Database Error:", e);
    res.status(500).json({ error: 'Internal Server Error', details: e.message });
  }
}