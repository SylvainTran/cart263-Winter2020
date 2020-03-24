// SnappedState
//
// State after the player has dragged a scene into range of another neighbouring scene
class SnappedState extends State {
    constructor() {
        super();
        this.handlePrimaryActionBt = this.transitionToLinkedState();
    }

    enter(dragHandler, moment, closestNeighbour) {
        console.log("Entering snapped state");
    }

    execute(dragHandler, moment, closestNeighbour) {
        // Temporary: if the createLink global variable was turned on by clicking on Create Link button, transition to Linked State
        if(createLink) {
            this.transitionToLinkedState();
            createLink = false;
        }
        //If the user moves the dragHandler out of range of the link snap range, then transition back to idle
        if ((Math.abs(dragHandler.getCenter().distance(closestNeighbour.getCenter())) >= 500)) {
            this.leaveSnappedState(moment, dragHandler, closestNeighbour);
        }
    }

    transitionToLinkedState() {
        console.log('Clicked on primary action button');
        console.log('Transitioning to linked state');
        
    }

    leaveSnappedState(moment, dragHandler, closestNeighbour) {
        moment.momentFSM.transition('IdleMomentState', [dragHandler, moment, closestNeighbour]);
        closestNeighbour.getData('moment').momentFSM.transition('IdleMomentState', [closestNeighbour.getData('moment').parent, closestNeighbour.getData('moment'), dragHandler]);
    }

    exit(dragHandler, moment, closestNeighbour) {
        //moment.displayLink(dragHandler, false);
    }
}