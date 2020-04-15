  // Scene moments' states
  class IdleMomentState extends State {
    constructor() {
      super();
    }

    enter(dragHandler, moment, closestNeighbour) {
      console.log("Entering idle moment state");
    }

    execute(dragHandler, moment, closestNeighbour) {

    }

    exit(dragHandler, moment, closestNeighbour) {

    }
  }