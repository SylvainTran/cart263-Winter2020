// Mainly used for scene ordering manipulation, but the elements could be anything else
class DoublyLinkedList {
    constructor(head) {
        // The first scene in the doubly-linked list
        this.head = head;
        // The last scene in the doubly-linked list (starts the same as the head)
        this.tail = head;
        // The doubly-linked list's max capacity
        this.maxCapacity = null;
    }

    //Add an element at the tail of the doubly linked list
    append(newElement) {
        // if the list is empty (i.e,. has no head), the first element is the head and the tail
        if (this.head === null) {
            this.head = newElement;
            this.tail = newElement;
        } else {
            newElement.previous = this.tail;
            this.tail.next = newElement;
            this.tail = newElement; // Update the doubly-linked list's tail as the new element
        }
    }

    removeElement(element) {

    }

    readLinkedList() {
        // Read the list -- this is the sequence player
    }
}