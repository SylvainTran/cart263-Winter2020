// Person
// Read The Artist is Present 2's code for this
// The Person is the base class for our custom sprites
class Person extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, avatarKey) {
        super(scene, x, y, avatarKey);
        scene.physics.world.enableBody(this);
        this.speed = 10;
        this.x = x;
        this.y = y;
    }
}
// YoutubePimpPlayer
//
// The controlled player, a Youtube pimp of sort (also called the Youtube Creator or a wizard)
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
    // Later on we'll set the inventory to things
    setInventory(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.inventory += value;
      }
    }
}
