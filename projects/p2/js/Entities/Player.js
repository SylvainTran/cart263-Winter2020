class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "Player");
        config.scene.add.existing(this);
        this.PlayerFSM = new StateMachine('idle', playerStates, [this, this.player]);     
    }
}