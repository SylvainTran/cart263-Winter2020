// Each moment node/scene manages its connections through this object, allowing
// the game to dynamically create many links reactively through the environment rather than
// through a single object dragged
class MomentConnectionManager {
    constructor(parent) {
        this.parent = parent;
        this.rangeToLink = 500; // Range at which connections are possible
    }

    checkForAvailableConnections(thisMoment, closestNeighbour) {
        return Math.abs(thisMoment.getCenter().distance(closestNeighbour.getCenter())) <= this.rangeToLink;
    }

    snapAvailableNeighbours(dragHandler, closestNeighbour) {
        // // If already in snap or linked state, return
        // if(thisMoment.getData('moment').momentFSM.state !== 'IdleMomentState') {
        //     console.log('Not idle ' + thisMoment.getData('moment').momentFSM.state);
        //     return;
        // }
        // if(closestNeighbour.getData('moment').momentFSM.state !== 'IdleMomentState') {
        //     console.log('Neighbour not idle ');
        //     return;
        // }
        // Update each moment's state to be "snapped"
        dragHandler.getData('moment').momentFSM.transition('SnappedState', [dragHandler.getData('moment').parent, dragHandler.getData('moment'), closestNeighbour]);
        closestNeighbour.getData('moment').momentFSM.transition('SnappedState', [closestNeighbour.getData('moment').parent, closestNeighbour.getData('moment'), closestNeighbour]);
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