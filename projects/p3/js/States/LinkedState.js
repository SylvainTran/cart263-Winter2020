// LinkedState
//
// State after the player has linked two moments together
class LinkedState extends State {
    constructor() {
        super();
        this.randomSnapDir = Math.random();
        this.snapValue = 300;
        this.negSnapValue = -300;
        this.linkLine = null;
        this.isLinked = false;
    }

    enter(dragHandler, moment, closestNeighbour) {
        // Tag this scene's linked state for event handling
        this.isLinked = true;
        // Set the new owner of the doubly linked list between this scene and its closest neighbour
        this.setNewDoublyLinkedListOwner(dragHandler.getData('moment'));
        if(dragHandler.getData('moment').isDoublyLinkedListOwner) {
            // Create the doubly linked list if we're the owner
            dragHandler.getData('moment').doublyLinkedList = new DoublyLinkedList(dragHandler.getData('moment'));
            // Append the closestNeighbour to the tail of the doubly linked list
            dragHandler.getData('moment').doublyLinkedList.append(dragHandler.scene.getClosestNeighbour().getData('moment'));
        }
        // Check if this linked state belongs to the owner
        if(dragHandler.getData('moment').isSnappedOwner) {
            this.displaySnappedState(dragHandler, moment, closestNeighbour);
            // disable dragging on both to lock them away
            dragHandler.scene.input.setDraggable([dragHandler, closestNeighbour], false);
        }
    }

    execute(dragHandler, moment, closestNeighbour) {

    }

    // Set this dragged moment as the owner of the linked list
    setNewDoublyLinkedListOwner(moment) {
        if (moment.isDoublyLinkedListOwner) {
            return;
        }
        moment.isDoublyLinkedListOwner = true;
    }

    displaySnappedState(dragHandler, moment, closestNeighbour) {
        // Put the same Y-pos for dragHandler and closestNeighbour
        // Set an offset between the two of 300 pixels
        dragHandler.scene.getClosestNeighbour().setPosition(dragHandler.x + this.snapValue, dragHandler.y);
        //dragHandler.getData('moment').refresh();
        dragHandler.scene.getClosestNeighbour().getData('moment').refresh();
    }

    exit(dragHandler, moment, closestNeighbour) {

    }

    createLinkLine(thisMoment, x, y, x1, y1, x2, y2, color, width, visible) {
        thisMoment.scene.linkLine = thisMoment.scene.add.line(x, y, x1, y1, x2, y2, color, visible).setOrigin(0)
            .setLineWidth(width);
    }

    setLinkLineVisible(thisMoment, visibility) {
        thisMoment.scene.linkLine.setVisible(visibility);
    }

    displayLink(thisMoment, moment, closestNeighbour, visible) {
        //console.log('Displaying link')
        thisMoment.scene.setLinkLineVisible(visible);
        thisMoment.scene.updateLinkLinePos(thisMoment.x, thisMoment.y, closestNeighbour.x, closestNeighbour.y);
    }

    updateLinkLinePos(thisMoment, x1, y1, x2, y2) {
        thisMoment.scene.linkLine.setTo(x1, y1, x2, y2);
    }
}