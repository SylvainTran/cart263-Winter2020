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
            // Reset the currently dragged scene and closest neighbour in Controller.js
            this.leaveSnappedState('IdleMomentState', context);
            // Cache the currently dragged scene and closest neighbour in Controller.js
            dragHandler.scene.setCurrentlyDraggedScene(dragHandler);
            dragHandler.scene.setCurrentlyDraggedSceneNeighbour(closestNeighbour);

            this.resetCurrentlyDraggedSceneNeighbour(dragHandler);
        }
    }

    resetCurrentlyDraggedSceneNeighbour(dragHandler) {
        dragHandler.scene.setCurrentlyDraggedScene(null);
        dragHandler.scene.setCurrentlyDraggedSceneNeighbour(null);
    }

    leaveSnappedState(newState, context) {
        console.debug("this");
        // Destroy the link button if it exists
        console.log(context[0].scene.getCreateLinkButton());
        if (context[0].scene.getCreateLinkButton()) {
            context[0].scene.getCreateLinkButton().destroy();
            context[0].scene.createdLinkButtonAlready = false;
        }
        if (newState === 'LinkedState') {
            // If we linked this state once already, set it off until we restart the game
            // PIPPIN - NEED TO UNDERSTAND CONTEXT AND OFF: createLinkEmitter.off('createLink', this.leaveSnappedState, context[0].getData('moment'));
        }
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