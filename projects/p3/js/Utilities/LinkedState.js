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

    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}