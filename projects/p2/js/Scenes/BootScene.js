class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  init() {

  }

  preload() {

  }

  create() {
    // Voice control
    if (annyang) {
      // inits the commands
      annyang.init(commands, true);
      // Add our commands to annyang (separated for clarity)
      annyang.addCommands(commands);
      // Start listening
      annyang.start();
    }
    // Append the phaser canvas in the flex box
    $('.main__game').append($('canvas'));
    this.scene.start('preloader');
  }

  update(time, delta) {

  }
}
