// Player
//
// Inherits from Agent
class Player extends Agent {
    constructor(x, y, size, color, maxSize) {
        super(x, y, size, color);
        this.maxSize = maxSize;
    }

    // updatePlayer()
    //
    // Set the position to the mouse location
    // Shrink the player
    updatePlayer() {
        this.x = mouseX;
        this.y = mouseY;
        // Shrink the player and use constrain() to keep it to reasonable bounds
        this.size = constrain(this.size - PLAYER_SIZE_LOSS, MINIMUM_SIZE, this.maxSize);
        if (this.size === MINIMUM_SIZE) {
            currentPlayerState = PlayerState.getItem('GameOver');
        }
    }
      
    // checkCollision()
    //
    // Calculate distance of player to food
    // Check if the distance is small enough to be an overlap of the two circles
    // If so, grow the player and reposition the food
    checkCollision() {
        let d = dist(this.x, this.y, food.x, food.y);
        if (d < this.size / 2 + food.size / 2) {
            this.size = constrain(this.size + PLAYER_SIZE_GAIN, MINIMUM_SIZE, this.maxSize);
            increaseScore();
            food.positionFood();
        }
    }  
}