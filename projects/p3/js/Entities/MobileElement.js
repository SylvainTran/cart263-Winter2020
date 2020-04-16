// Mobile Element
//
// Base class for our custom mobile sprites
class MobileElement extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, avatarKey) {
        super(scene, x, y, avatarKey);
        scene.physics.world.enableBody(this);
        this.speed = 50;
        this.x = x;
        this.y = y;
    }
}