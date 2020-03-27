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
            let context = [dragHandler, closestNeighbour];
            console.debug(context[0]);
            console.debug(context[1]);
            this.leaveSnappedState('IdleMomentState', context);
        }
    }

    leaveSnappedState(newState, context) {
        console.debug(arguments[0]);
        console.debug(arguments[1]);
        
        // Dragged scene
        context[0].getData('moment').momentFSM.transition(newState, context);
        // Closest neighbour
        context[1].getData('moment').momentFSM.transition(newState, context);
    }

    exit(dragHandler, moment, closestNeighbour) {
        //moment.displayLink(dragHandler, false);
    }
}