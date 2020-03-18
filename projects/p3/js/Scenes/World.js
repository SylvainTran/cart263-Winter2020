class World extends Phaser.Scene {

  constructor() {
    super({key: 'World'});
  }

  init(data) {

  }

  preload() {

  }

  create() {
    // Physics bounds
    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    this.cameras.main.setSize(window.innerWidth, window.innerHeight);
    // Deal with resizing event
    this.scale.on('resize', this.resize, this);
  }

  resize(newGameSize)
  {
    let width = newGameSize.width;
    let height = newGameSize.height;
    this.cameras.resize(width, height);
  }

  update(time, delta) {

  }
}