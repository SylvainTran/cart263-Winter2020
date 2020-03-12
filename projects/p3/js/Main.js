// Config file for phaser
//
// Physics to arcade
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
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
      BootScene, Preloader, UI 
    ]
  };