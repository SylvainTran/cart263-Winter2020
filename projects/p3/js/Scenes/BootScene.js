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

      // Randomize offset positions relative to parent pocket__game div
      console.log($('.main__game').width());
      let $parentCanvasWidth = $('.main__game').width();
      let $parentCanvasHeight = $('.main__game').height();

      $('canvas').each( (index, element) => {
        //console.log(element.offsetTop);
        //console.log(element.offsetLeft);
        let newTopPos = Math.floor(Math.random() * $parentCanvasHeight);
        let newLeftPos = Math.floor(Math.random() * $parentCanvasWidth);
        console.log("New top pos: " + newTopPos);
        console.log("New left pos: " + newLeftPos);
        // for each element canvas, randomly place it within the bounds of the main__game's width and height bounds
        console.log("Old top: " + element.style.top);
        element.style.position = "sticky";
        element.style.top = newTopPos + "px";
        element.style.left = newLeftPos + "px";
      });
      this.scene.start('preloader');
    }
  
    update(time, delta) {

    }
  }  