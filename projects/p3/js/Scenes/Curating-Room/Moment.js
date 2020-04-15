class Moment extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    init() {
        console.log('Moment base class');
    }

    preload() {

    }

    create() {

    }

    //Prototype definition: createLinkLine(...)
    //@args: many
    //creates a link line (must be set visible to be seen) when a dragged scene is in range of another scene
    // Also sets line width
    createLinkLine(x, y, x1, y1, x2, y2, color, width, visible) {

    }

    setLinkLineVisible() {

    }

    displayLink(closestNeighbour, visible) {

    }

    updateLinkLinePos(x1, y1, x2, y2) {

    }

    update(time, delta) {

    }
}