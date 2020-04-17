class MindSpaceForm extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, parent) {
        super(scene, x, y);
        this.setTexture('mindSpaceForm');
        this.setPosition(x, y - this.height/2);
        this.setInteractive();
        this.parent = parent;
        console.log("Created mind space");
    }
}