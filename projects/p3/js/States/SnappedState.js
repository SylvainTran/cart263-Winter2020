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
            let context = [dragHandler, dragHandler.getData('moment'), closestNeighbour];
            // Transition to Idle state
            this.leaveSnappedState('IdleMomentState', context);
        }
    }

    leaveSnappedState(newState, context) {
        // Destroy the link button if it exists
        if (context[0].scene.getCreateLinkButton()) {
            context[0].scene.getCreateLinkButton().destroy();
            context[0].scene.createdLinkButtonAlready = false;
        }
        if (newState === 'LinkedState') {
            // If we linked this state once already, set it off until we restart the game
            // PIPPIN - NEED TO UNDERSTAND CONTEXT AND OFF: createLinkEmitter.off('createLink', this.leaveSnappedState, context[0].getData('moment'));
        }
        // Transition the dragged scene
        context[0].getData('moment').momentFSM.transition(newState, context);
        // Transition the closest neighbour
        context[2].getData('moment').momentFSM.transition(newState, context);
    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}