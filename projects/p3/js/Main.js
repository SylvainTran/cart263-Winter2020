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
      BootScene, Controller
    ]
  };

let gameA = new Phaser.Game(config);

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