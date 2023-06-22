const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://chandana:chandana@atlascluster.hkw4khe.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Define MongoDB schema and models
const citySchema = new mongoose.Schema({
  name: String,
});

const legSchema = new mongoose.Schema({
  city1: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  city2: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  cost: Number,
});

const City = mongoose.model('City', citySchema);
const Leg = mongoose.model('Leg', legSchema);

// Define Express routes
app.post('/legs', async (req, res) => {
  try {
    const { city1Name, city2Name, cost } = req.body;

    const city1 = await City.create({ name: city1Name });
    const city2 = await City.create({ name: city2Name });

    const leg = await Leg.create({ city1, city2, cost });

    res.json(leg);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/legs', async (req, res) => {
  try {
    const legs = await Leg.find().populate('city1').populate('city2');
    res.json(legs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/legs/total-cost', async (req, res) => {
  try {
    const legs = await Leg.find();
    let totalCost = 0;

    for (let leg of legs) {
      totalCost += leg.cost;
    }

    res.json({ totalCost });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
