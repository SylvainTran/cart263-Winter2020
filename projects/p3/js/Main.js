// Config file for phaser
//
// Physics to arcade
let config = {
    type: Phaser.AUTO,
    width: 160,
    height: 160,
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

$('document').ready(setup);

function setup() {

}