// FishMan
//
// FishMan NPCs
class FishMan extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, dragZone, data) {
        super(scene, x, y, data);
        this.setTexture('p_001');
        this.setPosition(x, y);
        this.dragZone = dragZone;
        this.setInteractive();
    }
}