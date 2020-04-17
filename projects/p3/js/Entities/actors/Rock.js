// Rock
//
// Rock NPCs
class Rock extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setTexture('i_001');
        this.setPosition(x, y);
        this.setInteractive();
    }
}