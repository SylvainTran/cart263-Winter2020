class FindClosestNeighbour extends Strategy {
    constructor(self, neighbourArray) {
        super();
        this.self = self;
        this.neighbourArray = neighbourArray;
    }

    //Algorithm: findClosestNeighbour
    //@args: Uses this.self and this.momentsArray
    //Find the dragged self's closest neighbour, excluding self, by comparing distances from the center of the scene. Returns the closest moment gameObject
    algorithm() {
        // 1. Find out which scenes to compare with other than self
        let otherScenes = this.neighbourArray.filter((otherMoment) => {
            return otherMoment != this.self;
        });
        //console.log("Other scenes: " + otherScenes[0].name + ", " + otherScenes[1].name);

        // 2. Find closest distance from self to these scenes, by iterative approximation
        let indexClosest = 0; // First hypothesis
        for (let i = 0; i < otherScenes.length; i++) {
            if (Math.abs(this.self.getCenter().distance(otherScenes[i].getCenter())) <
                Math.abs(this.self.getCenter().distance(otherScenes[indexClosest].getCenter()))) {
                indexClosest = i;
            }
        }
        //console.log("Closest neighbour: " + otherScenes[indexClosest].name);
        return otherScenes[indexClosest];
    }
}