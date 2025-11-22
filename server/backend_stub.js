/**
 * KREST DENTAL BACKEND STUB
 * 
 * NOTE: This file is for reference or local testing only.
 * For Vercel hosting, the application uses the 'api/patients.js' file.
 * 
 * Instructions for local testing:
 * 1. Create a folder for your backend.
 * 2. Save this file as 'server.js'
 * 3. Run 'npm init -y'
 * 4. Run 'npm install express cors mongodb'
 * 5. Start the server: 'node server.js'
 */

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allows the frontend to talk to this backend
app.use(express.json());

// MongoDB Connection String
const uri = "mongodb+srv://xscade_db_user:bxm3aAtoeyjvbBWp@krest-survey.0d8ka06.mongodb.net/?appName=krest-survey";
const client = new MongoClient(uri);

let db;

// Connect to MongoDB once when server starts
async function connectDB() {
  try {
    await client.connect();
    db = client.db('krest_dental_db');
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

connectDB();

// API Endpoint to save patient data
app.post('/api/patients', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    const patientData = req.body;
    const collection = db.collection('patients');

    // Add timestamp
    const doc = {
      ...patientData,
      submittedAt: new Date(),
      status: 'New',
      source: 'local-dev-server'
    };

    const result = await collection.insertOne(doc);
    
    console.log(`Saved new patient: ${patientData.fullName}`);
    res.status(201).json({ success: true, id: result.insertedId });

  } catch (error) {
    console.error("Error saving patient:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get('/', (req, res) => {
  res.send('Krest Dental API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});