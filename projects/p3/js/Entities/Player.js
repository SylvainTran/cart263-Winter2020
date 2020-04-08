// Player
//
// The controlled player
class Player extends MobileElement {
    constructor(scene, x, y, avatarKey)
    {
        super(scene, x, y, avatarKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.PlayerFSM = new StateMachine('Idle', playerStates, [scene, this]);
        this.inventory = 0;
    }

    setInventory(value) {
      if(value)
      {
        this.inventory += value;
      }
    }
}
let playerStates = { "Idle": new PlayerIdleState, "Moving": new PlayerMovingState };
