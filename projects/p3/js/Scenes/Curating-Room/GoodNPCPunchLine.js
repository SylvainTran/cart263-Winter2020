class GoodNPCPunchLine extends Phaser.Scene {
    constructor(key, parent) {
      super(key);
      this.parent = parent;
      this.count = 0;
      this.WIDTH = 250;
      this.HEIGHT = 250;
    }
  
    init() {
      console.log('Init GoodNPCPunchLine');
    }
  
    preload() {

    }
  
    create() {
      this.add.isobox(1250, 500, 100, 100, '#77bf5e', '#77bf5e', '#77bf5e', '#77bf5e', '#77bf5e');
    }
  
    update(time, delta) {
  
    }
  }
  