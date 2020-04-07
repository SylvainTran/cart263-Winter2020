// Each moment node/scene manages its connections through this object, allowing
// the game to dynamically create many links reactively through the environment rather than
// through a single object dragged
class MomentConnectionManager {
    constructor(parent) {
        this.parent = parent;
        this.rangeToLink = 500; // Range at which connections are possible
    }

    checkForAvailableConnections(thisMoment, closestNeighbour) {
        if(closestNeighbour === null) {
            return;
        }
        return Math.abs(thisMoment.getCenter().distance(closestNeighbour.getCenter())) <= this.rangeToLink;
    }

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

    checkNeighbourTextStatus() {
        // Check the status of the neighbour's text roll

        // If there is something

        // Bifurcate using RiTA semantic category

        // 
    }

    orderConnections(thisMoment, closestNeighbour) {
        return thisMoment.getData('firstConnection') === closestNeighbour || thisMoment.getData('secondConnection') === closestNeighbour;
    }

    updateConnections(thisMoment, closestNeighbour) {
        // If this thisMoment already has a first connected scene, then add closestNeighbour as the second connection
        if (thisMoment.getData('firstConnection') !== null) {
            thisMoment.setData('secondConnection', closestNeighbour);
        } else {
            thisMoment.setData('firstConnection', closestNeighbour);
        }
        // Update the closestNeighbour's own first and second connections
        if (closestNeighbour.getData('firstConnection') !== null) {
            closestNeighbour.setData('secondConnection', thisMoment);
        } else {
            closestNeighbour.setData('firstConnection', thisMoment);
        }
    }

    updateActiveConnections(gameObject, add) {
        console.debug("Updating connections");
        if (add) { // Add connection
            if (gameObject.getData('activeConnections') < gameObject.getData('maxActiveConnections')) {
                let activeConnections = gameObject.getData('activeConnections');
                console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
                gameObject.setData('activeConnections', ++activeConnections);
                console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
            }
        } else { // Remove connection
            if (gameObject.getData('activeConnections') > 0) {
                let activeConnections = gameObject.getData('activeConnections');
                console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
                gameObject.setData('activeConnections', --activeConnections);
                console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
            }
        }
    }
}