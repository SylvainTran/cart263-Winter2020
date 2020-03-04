// Read The Artist is Present 2's code for this
class Person extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, avatarKey) {
        super(scene, x, y, avatarKey);
        scene.physics.world.enableBody(this);
        this.speed = 10;
        this.x = x;
        this.y = y;
    }
}

class YoutubePimpPlayer extends Person {
    constructor(scene, x, y, avatarKey)
    {
        super(scene, x, y, avatarKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.PlayerFSM = new StateMachine('idle', playerStates, [scene, this]);
        this.inventory = 0;
    }

    set inventory(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.inventory += value;
      }
    }
}
