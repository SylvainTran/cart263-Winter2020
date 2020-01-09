// Food
//
// Food class that extends agent
class Food extends Agent {
    constructor(x, y, size, color) {
        super(x, y, size, color);
    }

// positionFood()
//
// Set the food's position properties to random numbers within the canvas dimensions
positionFood() {
    this.x = random(0, width);
    this.y = random(0, height);
  }  
}