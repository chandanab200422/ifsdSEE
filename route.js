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
    constructor() {+
      this.legs == [];
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
  
  function main() {
    const route = new Route();
  
    const numLegs = parseInt(prompt("Enter the number of legs in the route:"));
  
    for (let i = 0; i < numLegs; i++) {
      console.log(`\nLeg ${i + 1}:`);
      const city1Name = prompt("Enter the name of the first city:");
      const city2Name = prompt("Enter the name of the second city:");
      const cost = parseFloat(prompt("Enter the cost of the leg:"));
  
      const city1 = new City(city1Name);
      const city2 = new City(city2Name);
      const leg = new Leg(city1, city2, cost);
  
      route.addLeg(leg);
    }
  
    const totalCost = route.calculateTotalCost();
    console.log(`\nThe total cost of the trip is: ${totalCost}`);
  }
  
  main();
  