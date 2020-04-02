// SnappedState
//
// State after the player has dragged a scene into range of another neighbouring scene
class SnappedState extends State {
    constructor() {
        super();
    }

    enter(dragHandler, moment, closestNeighbour) {

    }

    execute(dragHandler, moment, closestNeighbour) {
        //If the user moves the dragHandler out of range of the link snap range, then transition back to idle
        if ((Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())) >= 500)) {
            const context = [dragHandler, dragHandler.getData('moment'), closestNeighbour];
            // Transition to Idle state
            dragHandler.getData('moment').momentFSM.transition('IdleMomentState', context);
        }
    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}