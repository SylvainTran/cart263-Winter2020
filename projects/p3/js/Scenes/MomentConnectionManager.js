// Each moment node/scene manages its connections through this object, allowing
// the game to dynamically create many links reactively through the environment rather than
// through a single object dragged
class MomentConnectionManager {
    constructor(scene){
        this.scene = scene;
    }

    orderConnections(go, closestNeighbour) {
        return go.getData('firstConnection') === closestNeighbour || go.getData('secondConnection') === closestNeighbour;
    }

    checkDistance(go, closestNeighbour, rangeToLink) {
        return Math.abs(go.getCenter().distance(closestNeighbour.getCenter())) <= rangeToLink;
    }

    updateConnections(go, closestNeighbour) {
        // If this go already has a first connected scene, then add closestNeighbour as the second connection
        if (go.getData('firstConnection') !== null) {
            go.setData('secondConnection', closestNeighbour);
        }
        else {
            go.setData('firstConnection', closestNeighbour);
        }
        // Update the closestNeighbour's own first and second connections
        if (closestNeighbour.getData('firstConnection') !== null) {
            closestNeighbour.setData('secondConnection', go);
        }
        else {
            closestNeighbour.setData('firstConnection', go);
        }
    }

    //findClosestNeighbour(gameObject)
    //@args: gameObject
    //Find this dragged scene's closest neighbour, excluding self, by comparing distances from the center of the scene. Returns the closest go
    findClosestNeighbour(gameObject) {
        // 1. Find out which scenes to compare with other than self
        let otherScenes = this.draggableZonesActive.filter( (go) => {
            return go != gameObject;
        });
        //console.log("Other scenes: " + otherScenes[0].name + ", " + otherScenes[1].name);

        // 2. Find closest distance from self to these scenes, by iterative approximation
        let indexClosest = 0; // First hypothesis
        for(let i = 0; i < otherScenes.length; i++) {
            if(Math.abs(gameObject.getCenter().distance( otherScenes[i].getCenter())) 
            < Math.abs(gameObject.getCenter().distance(otherScenes[indexClosest].getCenter())) ) 
            {
            indexClosest = i;
            }
        }
        //console.log("Closest neighbour: " + otherScenes[indexClosest].name);
        return otherScenes[indexClosest];
    }

    updateActiveConnections(gameObject, add) {
        console.debug("Updating connections");
        if(add) { // Add connection
            if(gameObject.getData('activeConnections') < gameObject.getData('maxActiveConnections')) {
            let activeConnections = gameObject.getData('activeConnections');
            console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
            gameObject.setData('activeConnections', ++activeConnections);
            console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
            }  
        }
        else { // Remove connection
            if(gameObject.getData('activeConnections') > 0) {
            let activeConnections = gameObject.getData('activeConnections');
            console.debug("Old number of active connections: " + gameObject.getData('activeConnections'));
            gameObject.setData('activeConnections', --activeConnections);
            console.debug("New number of active connections: " + gameObject.getData('activeConnections'));
            }  
        }
    }
}