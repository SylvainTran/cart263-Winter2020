/**

Questionnaire Hero : The Dream of a Ridiculous Man, Caviar Remix ft. Rey

Micro rpg game with walking, talking, AND splendid questionnaire writing action.
Based on a Fyodor Dostoevsky novel using Phaser 3. Project for cart 263 (winter 2020).
See README.md for more details.

...

Author: sylvain r. tran
PROJECT FOR CART 263 - WINTER 2020, BY DR. PIPPIN BAR

Copyright/Attribution Notice:

Music (piano theme): HitCtrl
Click on scene: p0ss
Link button: NenadSimic
Entering a Scene Dimension (Epic Amulet Item): CosmicD
Footstep (Dirt, Water): Little Robot Sound Factory
Animated book by gkhnsolak
Creatures by Luis Zuno (@ansimuz)
Through Pixelated Clouds by bart - https://opengameart.org/content/through-pixelated-clouds-8-bit-airship-remix
16x16-1-bit rpg forest tile set by bigindie
Some other attributions may have been forgotten if they were CC0.

*/

// Config file for phaser
//
// Configures phaser
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff',
  disableContextMenu: true,
  scale: {
    parent: 'main__world-node-container',
    mode: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 640
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  dom: {
    createContainer: true
  },
  scene: [
    Preloader, StartMenu, Controller, UI, Hud, World
  ]
};
let game = new Phaser.Game(config);