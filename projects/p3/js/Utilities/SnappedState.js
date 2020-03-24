// SnappedState
//
// State after the player has dragged a scene into range of another neighbouring scene
class SnappedState extends State {
    constructor() {
        super();
    }

    enter(dragHandler, moment, closestNeighbour) {
        console.log("Entering snapped state");
    }

    execute(dragHandler, moment, closestNeighbour) {
        // Listen for input Return or Create Link button to create a Transition to Linked State
        //If the user moves the dragHandler out of range of the link snap range, then transition back to idle
        if ((Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())) >= 500)) {
            this.leaveSnappedState(moment, dragHandler, closestNeighbour);
        }
    }

    leaveSnappedState(moment, dragHandler, closestNeighbour) {
        moment.momentFSM.transition('IdleMomentState', [dragHandler, moment, closestNeighbour]);
        closestNeighbour.getData('moment').momentFSM.transition('IdleMomentState', [closestNeighbour.getData('moment').parent, closestNeighbour.getData('moment'), dragHandler]);
    }

    exit(dragHandler, moment, closestNeighbour) {
        //moment.displayLink(dragHandler, false);
    }
}