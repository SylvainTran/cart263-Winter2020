// LinkedState
//
// State after the player has linked two moments together
class LinkedState extends State {
    constructor() {
        super();
        this.isLinked = false;
    }

    enter(dragHandler, moment, closestNeighbour) {
        // Tag this scene's linked state for event handling
        this.isLinked = true;
    }

    execute(dragHandler, moment, closestNeighbour) {

    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}