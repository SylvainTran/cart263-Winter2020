class MindSpaceForm extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dragZone, data) {
        super(scene, x, y, data);
        this.setTexture('mindSpaceForm');
        this.setPosition(x, y);
        this.dragZone = dragZone;
        this.setInteractive();
    }
}