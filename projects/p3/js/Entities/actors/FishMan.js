// FishMan
//
// FishMan NPCs
class FishMan extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setTexture('p_001');
        this.setPosition(x, y);
        this.setInteractive();
    }
}