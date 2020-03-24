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
        // Temporary: if the createLink global variable was turned on by clicking on Create Link button, transition to Linked State
        if(createLink) {
            this.leaveSnappedState('LinkedState', dragHandler, moment, closestNeighbour);
            createLink = false;
        }
        //If the user moves the dragHandler out of range of the link snap range, then transition back to idle
        if ((Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())) >= 500)) {
            this.leaveSnappedState('IdleMomentState', dragHandler, moment, closestNeighbour);
        }
    }

    leaveSnappedState(newState, dragHandler, moment, closestNeighbour) {
        let context = [dragHandler, moment, closestNeighbour];
        moment.momentFSM.transition(newState, context);
        // TODO ask pippin, two owners here if both transition into linked state?
        //closestNeighbour.getData('moment').momentFSM.transition(newState, [closestNeighbour.getData('moment').parent, closestNeighbour.getData('moment'), dragHandler]);
    }

    exit(dragHandler, moment, closestNeighbour) {
        //moment.displayLink(dragHandler, false);
    }
}