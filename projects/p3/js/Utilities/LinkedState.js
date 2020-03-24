// LinkedState
//
// State after the player has linked two moments together
class LinkedState extends State {
    constructor() {
        super();
    }

    enter(dragHandler, moment, closestNeighbour) {
        console.log("Entering linked state");
    }

    execute(dragHandler, moment, closestNeighbour) {
        // Now update the data for this moment and closestNeighbour
        
        // Permanent link display for draghandler and closestNeighbour
        // Link cannot be broken anymore (for now)
        // This particular scene cannot be re-snapped but can still be linked to from other, yet un-snapped scenes 
    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}