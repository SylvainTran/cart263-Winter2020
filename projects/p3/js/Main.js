// Config file for phaser
//
// Physics to arcade
let config = {
    type: Phaser.AUTO,
    width: 320,
    height: 320,
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: {
          y: 0
        }
      }
    },
    scene: [
      BootScene, Preloader 
    ]
  };

let game = new Phaser.Game(config);
