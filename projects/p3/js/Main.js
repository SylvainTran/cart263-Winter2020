/**
* 
THE DREAM OF A RIDICULOUS MAN

A GAME ON THE SADNESS OF LIFE
...

Author: Sylvain Serey Tran
PROJECT FOR CART 263 - WINTER 2020, BY DR. PIPPIN BAR

Copyright/Attribution Notice: 
Music (piano theme): HitCtrl
Click on scene: p0ss
Link button: NenadSimic
Entering a Scene Dimension (Epic Amulet Item): CosmicD
Footstep (Dirt, Water): Little Robot Sound Factory
*/

// Config file for phaser
//
// Physics to arcade
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffffff',
  disableContextMenu: true,
  scale: {
    parent: 'main__world-node-container',
    mode: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
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
    Preloader, Controller
  ]
};
let game = new Phaser.Game(config);

$('document').ready(setup);

let $hamburgerMenu;
let $navBar;
let sticky;
// If two moments are currently linked
let updateDataAndActiveConnections = false;
let createLink = false;

function setup() {
  $hamburgerMenu = $('.nav__hamburger-menu');
  $navBar = $('#navBar');
  const STICKY_OFFSET = 10;
  sticky = $hamburgerMenu.offset().top - STICKY_OFFSET;
  window.onscroll = function () {
    handleNav();
  };
}

function handleNav() {
  if (window.pageYOffset >= sticky) {
    $navBar.addClass('sticky');
    $hamburgerMenu.addClass('sticky');
  } else {
    $navBar.removeClass('sticky');
    $hamburgerMenu.removeClass('sticky');
  }
}