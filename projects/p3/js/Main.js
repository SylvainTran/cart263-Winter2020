// Config file for phaser
//
// Physics to arcade
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#676767',
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
    BootScene, Controller
  ]
};
let game = new Phaser.Game(config);

$('document').ready(setup);
let $hamburgerMenu;
let $navBar;
let sticky;
// If two moments are currently linked
let updateDataAndActiveConnections = false;

function setup() {
  $hamburgerMenu = $('.nav__hamburger-menu');
  $navBar = $('#navBar');
  const STICKY_OFFSET = 10;
  sticky = $hamburgerMenu.offset().top - STICKY_OFFSET;
  window.onscroll = function () {
    handleNav();
  };

  // Handle the contextual primary action button
  $('.main--current-status__button').on('click', handlePrimaryActionBt);
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

function handlePrimaryActionBt() {
  console.log('Clicked on primary action button');
  // If updateDataAndActiveConnections is true
  console.debug('State of link: ' + updateDataAndActiveConnections);
  if (updateDataAndActiveConnections) {
    console.debug('Currently able to link');
  }
}