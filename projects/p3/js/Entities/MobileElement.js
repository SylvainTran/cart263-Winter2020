// Mobile Element
//
// Base class for our custom sprites
class MobileElement extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, avatarKey) {
        super(scene, x, y, avatarKey);
        scene.physics.world.enableBody(this);
        this.speed = 500;
        this.x = x;
        this.y = y;
    }
}