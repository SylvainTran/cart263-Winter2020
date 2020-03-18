$('document').ready(setup);
let $hamburgerMenu;
let $navBar;
let sticky;

function setup() {
  $hamburgerMenu = $('.nav__hamburger-menu');
  $navBar = $('#navBar');
  sticky = $hamburgerMenu.offset().top;
  window.onscroll = function() {
    handleNav();
  };
}

function handleNav() {
  if(window.pageYOffset >= sticky)
  {
    $navBar.addClass('sticky');
    $hamburgerMenu.addClass('sticky');
  } else {
    $navBar.removeClass('sticky');
    $hamburgerMenu.removeClass('sticky');
  } 
}

// Config file for phaser
//
// Physics to arcade
let config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
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
let gameA = new Phaser.Game(config);