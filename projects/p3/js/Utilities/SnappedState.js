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
        console.log(Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())));
        //If the user moves the dragHandler out of range of the link snap range, then transition back to idle
        if ((Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())) >= 500)) {
            console.log('State before transiti. ' + moment.momentFSM.state);
            moment.momentFSM.transition('IdleMomentState', [dragHandler, moment, closestNeighbour]);
            console.log('State after transiti. ' + moment.momentFSM.state);
        }
    }

    exit(dragHandler, moment, closestNeighbour) {
        //moment.displayLink(dragHandler, false);
    }
}