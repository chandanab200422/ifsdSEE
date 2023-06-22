const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

// Define Mongoose schemas
const citySchema = new mongoose.Schema({
  name: String
});

const legSchema = new mongoose.Schema({
  city1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  city2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  cost: Number
});

const routeSchema = new mongoose.Schema({
  legs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Leg'
  }]
});

// Define Mongoose models
const City = mongoose.model('City', citySchema);
const Leg = mongoose.model('Leg', legSchema);
const Route = mongoose.model('Route', routeSchema);

async function connectToDatabase() {
  await mongoose.connect('mongodb+srv://chandana:chandana@atlascluster.hkw4khe.mongodb.net/routes1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');
}

async function createCity(name) {
  const city = new City({ name });
  return city.save();
}

async function createLeg(city1, city2, cost) {
  const leg = new Leg({ city1, city2, cost });
  return leg.save();
}

async function createRoute(legs) {
  const route = new Route({ legs });
  return route.save();
}

async function readRoutes() {
  return Route.find().populate('legs').exec();
}

async function updateRoute(routeId, updatedData) {
  return Route.updateOne({ _id: routeId }, { $set: updatedData });
}

async function main() {
  await connectToDatabase();

  const route = new Route();
  const numLegs = parseInt(prompt('Enter the number of legs in the route:'));

  for (let i = 0; i < numLegs; i++) {
    console.log(`\nLeg ${i + 1}:`);
    const city1Name = prompt('Enter the name of the first city:');
    const city2Name = prompt('Enter the name of the second city:');
    const cost = parseFloat(prompt('Enter the cost of the leg:'));

    const city1 = await createCity(city1Name);
    const city2 = await createCity(city2Name);
    const leg = await createLeg(city1, city2, cost);

    route.legs.push(leg);
  }

  const totalCost = route.legs.reduce((sum, leg) => sum + leg.cost, 0);
  console.log(`\nThe total cost of the trip is: ${totalCost}`);

  console.log('Creating route in the database...');
  const savedRoute = await createRoute(route.legs);
  console.log('Route created with ID:', savedRoute._id);

  console.log('\nReading all routes from the database...');
  const routes = await readRoutes();
  console.log('Routes:', routes);

  console.log('\nUpdating the route in the database...');
  const updatedData = { totalCost: totalCost + 100 };
  const { nModified } = await updateRoute(savedRoute._id, updatedData);
  console.log('Route updated. Modified count:', nModified);
}

main().catch(console.error);
