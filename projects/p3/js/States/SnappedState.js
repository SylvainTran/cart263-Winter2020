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
            // Destroy the create link button
            let controller = dragHandler.scene.controller;
            let button = dragHandler.scene.controller.createdLinkButton;
            if(button) {
                button.destroy();
                // Reset the created link button already flag
                dragHandler.scene.controller.createdLinkButtonAlready = false;
                // Create a new player if there isn't one already
                if(!controller.World.globalPlayer) {
                    controller.resetPlayer(moment, dragHandler.scene.controller);
                }
            }
            const context = [dragHandler, dragHandler.getData('moment'), closestNeighbour];
            // Transition to Idle state
            dragHandler.getData('moment').momentFSM.transition('IdleMomentState', context);
            closestNeighbour.getData('moment').momentFSM.transition('IdleMomentState', context);
        }
    }

    exit(dragHandler, moment, closestNeighbour) {

    }
}