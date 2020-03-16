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
      let pocketDiv = document.createElement('div');
      $('.pocket__game').append($(pocketDiv));
      $(pocketDiv).append($(this.game.canvas)); // Just this instance's canvas
      $(this.game.canvas).draggable({axis: 'x'}); // Restrain to x-axis (also the div flex colum direction does this somehow)
      this.game.canvas.style.zIndex = 1;
      // Randomize offset positions relative to parent pocket__game div
      console.log($('.main__game').width());
      let $parentCanvasWidth = $('.main__game').width();
      let $parentCanvasHeight = $('.main__game').height();

      // Create the inset box at the middle to sequence divs
      // let insetBox = document.createElement('div');
      // insetBox.style.position = 'fixed';
      // insetBox.style.top = window.innerHeight + 'px';
      // insetBox.style.left = window.innerWidth/2 + 'px';
      // insetBox.style.width = '160px';
      // insetBox.style.height = '160px';
      // insetBox.style.backgroundColor = 'cyan';
      // insetBox.style.zIndex = 0;
      // $('.pocket__game').append(insetBox);

      $('canvas').each( (index, element) => {
        let newTopPos = Math.floor(Math.random() * $parentCanvasHeight);
        let newLeftPos = Math.floor(Math.random() * $parentCanvasWidth);
        // console.log("New top pos: " + newTopPos);
        // console.log("New left pos: " + newLeftPos);
        // for each element canvas, randomly place it within the bounds of the main__game's width and height bounds
        // console.log("Old top: " + element.style.top);
        element.style.position = "sticky";
        element.style.top = newTopPos + "px";
        element.style.left = newLeftPos + "px";
        element.classList.add("pocket-game");
      });
      this.scene.start('preloader');
    }
  
    update(time, delta) {

    }
  }  