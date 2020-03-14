class BootScene extends Phaser.Scene {
    constructor() {
      super('boot');
    }
  
    init() {
  
    }
  
    preload() {
  
    }
  
    create() {
      // Append the phaser canvas in the flex box
      $('.pocket__game').append($('canvas'));
      this.scene.start('preloader');
    }
  
    update(time, delta) {
  
    }
  }  