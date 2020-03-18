class World extends Phaser.Scene {

    constructor() {
      super({key: 'World'});
    }
  
    init(data) {
  
    }
  
    preload() {
  
    }
  
    create() {
      // Physics bounds
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
      this.cameras.main.setSize(window.innerWidth, window.innerHeight);
    }
  
    update(time, delta) {

    }
  }