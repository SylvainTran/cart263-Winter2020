// LinkedState
//
// State after the player has linked two moments together
class LinkedState extends State {
    constructor() {
        super();
        this.randomSnapDir = Math.random();
        this.snapValue = 300;
        this.negSnapValue = -300;
    }

    enter(dragHandler, moment, closestNeighbour) {
        console.log("Entering linked state");
        this.linkLine = this.createLinkLine(dragHandler, 160, 160, 0, 0, 100, 100, 0xFFFFFF, 5, true);
    }

    execute(dragHandler, moment, closestNeighbour) {
        // Now update the data for this moment and closestNeighbour
        // Meaning, update the doubly linked list
        // After setting this dragged handler as the owner of the list
        // Set the dragged scene as the owner of the doubly linked list, to preserve the sequence's order
        this.setNewDoublyLinkedListOwner(dragHandler.getData('moment'));
        // console.debug(dragHandler.getData('moment'));
        if (dragHandler.getData('moment').isDoublyLinkedListOwner) {
            // Append the closestNeighbour to the tail of the doubly linked list
            dragHandler.getData('moment').doublyLinkedList.append(dragHandler.scene.getClosestNeighbour().getData('moment'));
        }

        if(dragHandler.getData('moment').isSnappedOwner) {
            //this.displaySnappedState(dragHandler, moment, closestNeighbour);
        }
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
        dragHandler.scene.getClosestNeighbour().setPosition(dragHandler.x + this.snapValue, dragHandler.y + this.snapValue);
        dragHandler.getData('moment').refresh();
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