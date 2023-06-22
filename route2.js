const { MongoClient } = require('mongodb');
const prompt = require('prompt-sync')();

class City {
  constructor(name) {
    this.name = name;
  }
}

class Leg {
  static nextId = 1;

  constructor(city1, city2, cost) {
    this.id = Leg.nextId++;
    this.city1 = city1;
    this.city2 = city2;
    this.cost = cost;
  }
}

class Route {
  constructor() {
    this.legs = [];
  }

  addLeg(leg) {
    this.legs.push(leg);
  }

  calculateTotalCost() {
    let totalCost = 0;
    for (let leg of this.legs) {
      totalCost += leg.cost;
    }
    return totalCost;
  }
}

async function connectToDatabase() {
  const uri = 'mongodb+srv://chandana:chandana@atlascluster.hkw4khe.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('routes');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function createRoute(route) {
  const db = await connectToDatabase();
  const collection = db.collection('routes');

  try {
    const result = await collection.insertOne(route);
    console.log('New route created');
    return result.insertedId;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
}

async function readRoutes() {
  const db = await connectToDatabase();
  const collection = db.collection('routes');

  try {
    const routes = await collection.find().toArray();
    return routes;
  } catch (error) {
    console.error('Error reading routes:', error);
    throw error;
  }
}

async function updateRoute(routeId, updatedData) {
  const db = await connectToDatabase();
  const collection = db.collection('routes');

  try {
    const result = await collection.updateOne(
      { _id: routeId },
      { $set: updatedData }
    );
    console.log('Route updated');
    return result.modifiedCount;
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
}

async function main() {
  const route = new Route();

  const numLegs = parseInt(prompt('Enter the number of legs in the route:'));

  for (let i = 0; i < numLegs; i++) {
    console.log(`\nLeg ${i + 1}:`);
    const city1Name = prompt('Enter the name of the first city:');
    const city2Name = prompt('Enter the name of the second city:');
    const cost = parseFloat(prompt('Enter the cost of the leg:'));

    const city1 = new City(city1Name);
    const city2 = new City(city2Name);
    const leg = new Leg(city1, city2, cost);

    route.addLeg(leg);
  }

  const totalCost = route.calculateTotalCost();
  console.log(`\nThe total cost of the trip is: ${totalCost}`);

  console.log('Creating route in the database...');
  const routeId = await createRoute(route);
  console.log(`Route created with ID: ${routeId}`);

  console.log('\nReading all routes from the database...');
  const routes = await readRoutes();
  console.log('Routes:', routes);

  console.log('\nUpdating the route in the database...');
  const updatedData = { totalCost: totalCost + 100 };
  const modifiedCount = await updateRoute(routeId, updatedData);
  console.log(`Route updated. Modified count: ${modifiedCount}`);
}

main().catch(console.error);
