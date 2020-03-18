class CriticalHit extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
      this.WIDTH = 250;
      this.HEIGHT = 250;
    }
  
    init() {
      console.log('Init CriticalHit');
    }
  
    preload() {

    }
  
    create() {
      this.add.circle(150, 150, 100, '#77bf5e');
    }
  
    update(time, delta) {
  
    }
  }