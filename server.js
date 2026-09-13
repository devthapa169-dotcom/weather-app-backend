const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

let serviceAccount;
if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
} else {
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/log-visit', async (req, res) => {
  try {
    const { city, lat, lon } = req.body;

    await db.collection('visits').add({
      city: city || null,
      lat: lat || null,
      lon: lon || null,
      timestamp: new Date()
    });

    res.send({ success: true });
  } catch (error) {
    console.log('Error saving visit:', error);
    res.status(500).send({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
