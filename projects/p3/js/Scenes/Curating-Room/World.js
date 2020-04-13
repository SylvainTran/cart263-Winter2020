class World extends Moment {
  constructor(key, controller) {
    super('World');
    this.controller = null;
    this.globalPlayer = null; // The player residing in the World (global scene)
  }

  init() {
    this.controller = this.scene.manager.getScene('Controller');
  }

  preload() {

  }

  create() {
    // Physics bounds
    this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
    this.cameras.main.setSize(window.innerWidth, window.innerHeight);
    // Link line linking each moment/scenes
    let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '1877.').setOrigin(0.5);
    // Deal with resizing event
    this.scale.on('resize', this.resize, this);
  }

  resize(newGameSize) {
    let width = newGameSize.width;
    let height = newGameSize.height;
    this.cameras.resize(width, height);
  }

  update(time, delta) {

  }
}