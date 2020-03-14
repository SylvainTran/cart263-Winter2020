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

let gameA = new Phaser.Game(config);
let gameB = new Phaser.Game(config);
let gameC = new Phaser.Game(config);
let gameD = new Phaser.Game(config);
let gameE = new Phaser.Game(config);
let gameF = new Phaser.Game(config);
let gameG = new Phaser.Game(config);
let gameH = new Phaser.Game(config);
