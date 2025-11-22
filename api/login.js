import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://xscade_db_user:bxm3aAtoeyjvbBWp@krest-survey.0d8ka06.mongodb.net/?appName=krest-survey";

let client;
let clientPromise;

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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('krest_dental_db');
    const admins = db.collection('admins');

    // Check if any admin exists, if not create default for setup
    const adminCount = await admins.countDocuments();
    if (adminCount === 0) {
      await admins.insertOne({ 
        username: 'admin', 
        password: 'password', 
        createdAt: new Date() 
      });
      console.log("Seeded default admin user");
    }

    // Authenticate
    const user = await admins.findOne({ username });

    if (user && user.password === password) {
      res.status(200).json({ success: true, token: 'session_valid' });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }

  } catch (e) {
    console.error("Auth Error:", e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}