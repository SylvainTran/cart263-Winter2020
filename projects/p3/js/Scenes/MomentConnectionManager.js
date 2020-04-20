// MomentConnectionManager
//
// An object that scenes can contain to manage their connections. Eventually game objects may get this for puzzles
class MomentConnectionManager {
    // Constructs connections 
    // with a range to link between its parent scene and a closest neighbour
    constructor(parent) {
        this.parent = parent;
        this.rangeToLink = 500; // Range at which connections are possible
    }

    // checkForAvailableConnections
    //
    // check for available connections between this scene and its closest neighbour
    checkForAvailableConnections(thisMoment, closestNeighbour) {
        if(closestNeighbour === null) {
            return;
        }
        return Math.abs(thisMoment.getCenter().distance(closestNeighbour.getCenter())) <= this.rangeToLink;
    }

    // snapAvailableNeighbours
    //
    // Snaps available neighbours
    snapAvailableNeighbours(dragHandler, closestNeighbour) {
        // If this scene or its closestNeighbour is already snapped, return
        if (dragHandler.getData('moment').momentFSM.state === 'SnappedState' || closestNeighbour.getData('moment').momentFSM.state === 'SnappedState') {
            return;
        }
        // Update the dragged scene as the "snap owner"
        // If neither are snap owners yet
        if (!dragHandler.getData('moment').isSnappedOwner &&
            !closestNeighbour.getData('moment').isSnappedOwner) {
            dragHandler.getData('moment').isSnappedOwner = true;
        }
        // Transition each moment's state to be "snapped"
        dragHandler.getData('moment').momentFSM.transition('SnappedState', [dragHandler.getData('moment').parent, dragHandler.getData('moment'), closestNeighbour]);
        closestNeighbour.getData('moment').momentFSM.transition('SnappedState', [closestNeighbour.getData('moment').parent, closestNeighbour.getData('moment'), closestNeighbour]);
    }

    //checkNeighbourTextStatus
    //
    // Checks neighbour text status
    checkNeighbourTextStatus(self, neighbour) {
        // Check the status of the neighbour's text roll
        let selfScene = self.getData('moment');
        let neighbourScene = neighbour.getData('moment');
        if(neighbourScene.sceneTextRepresentation) {
            // If playing animation and at the edge of its scene height
            if(selfScene.playingTextAnimation && neighbourScene.playingTextAnimation) {
                console.debug("Bifurcating");
                selfScene.setSceneTextRepresentation(neighbourScene.sceneTextRepresentation.text);
                neighbourScene.setSceneTextRepresentation(selfScene.sceneTextRepresentation.text);
            }
        }
    }
}