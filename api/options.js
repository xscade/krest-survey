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

const DEFAULT_OPTIONS = {
  reasons: [
    'Pain / Sensitivity',
    'Cleaning / Check-up',
    'Tooth Cavity',
    'Braces / Aligners',
    'Cosmetic Concern',
    'Not Sure / Consultation'
  ],
  sources: [
    'Google Search',
    'Google Ads',
    'Instagram',
    'Facebook',
    'Practo',
    'Google Maps',
    'Friend / Family',
    'Walk-in',
    'Other'
  ]
};

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('krest_dental_db');
    const collection = db.collection('form_options');

    if (req.method === 'GET') {
      const options = await collection.findOne({ _id: 'global_options' });
      if (!options) {
        // Return defaults if not configured in DB yet
        return res.status(200).json(DEFAULT_OPTIONS);
      }
      res.status(200).json(options);
    } 
    else if (req.method === 'POST') {
      const { reasons, sources } = req.body;
      
      if (!Array.isArray(reasons) || !Array.isArray(sources)) {
        return res.status(400).json({ error: 'Invalid format' });
      }

      await collection.updateOne(
        { _id: 'global_options' },
        { $set: { reasons, sources, updatedAt: new Date() } },
        { upsert: true }
      );

      res.status(200).json({ success: true });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (e) {
    console.error("Options API Error:", e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}