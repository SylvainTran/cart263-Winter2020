// SnappedState
//
// State after the player has dragged a scene into range of another neighbouring scene
class SnappedState extends State {
    constructor() {
        super();
        this.randomSnapDir = Math.random();
        this.snapValue = 300;
        this.negSnapValue = -300;
    }

    enter(dragHandler, moment, closestNeighbour) {
        console.log("Entering snapped state");
    }

    execute(dragHandler, moment, closestNeighbour) {
        if(moment.isSnappedOwner) {
            this.displaySnappedState(dragHandler, moment, closestNeighbour);
        }
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

    displaySnappedState(dragHandler, moment, closestNeighbour) {
        // Put the same Y-pos for dragHandler and closestNeighbour
        // Set an offset between the two of 300 pixels
        if(this.randomSnapDir < 0.5) {
            closestNeighbour.setPosition(dragHandler.x + this.snapValue, dragHandler.y + this.snapValue);
        }
        else {
            closestNeighbour.setPosition(dragHandler.x + this.negSnapValue, dragHandler.y + this.negSnapValue);
        }
        moment.refresh();
        closestNeighbour.getData('moment').refresh();
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