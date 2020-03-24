// LinkedState
//
// State after the player has linked two moments together
class LinkedState extends State {
    constructor() {
        super();
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
        this.setNewDoublyLinkedListOwner(moment);
        if (moment.isDoublyLinkedListOwner) {
            // Append the closestNeighbour to the tail of the doubly linked list
            moment.doublyLinkedList.append(closestNeighbour.getData('moment'));
            // TODO Tag the scene for UX
        }
        // TODO Permanent link display for draghandler and closestNeighbour
        // Link cannot be broken anymore (unless this is added later)
        this.displayLink(dragHandler, moment, closestNeighbour, true);
        // This particular scene cannot be re-snapped but can still be linked to from other, yet un-snapped scenes 
    }

    // Set this dragged moment as the owner of the linked list
    setNewDoublyLinkedListOwner(moment) {
        if (moment.isDoublyLinkedListOwner) {
            return;
        }
        moment.isDoublyLinkedListOwner = true;
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
        console.log('Displaying link')
        thisMoment.scene.setLinkLineVisible(visible);
        thisMoment.scene.updateLinkLinePos(thisMoment.x, thisMoment.y, closestNeighbour.x, closestNeighbour.y);
    }

    updateLinkLinePos(thisMoment, x1, y1, x2, y2) {
        thisMoment.scene.linkLine.setTo(x1, y1, x2, y2);
    }
}