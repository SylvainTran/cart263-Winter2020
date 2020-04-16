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
    // Create the game world's tilemap
    this.worldTilemap = this.make.tilemap({key: "world"});
    // Create the tileset from the map, using our preloaded assets
    this.worldTileset = this.worldTilemap.addTilesetImage("world-bw", "worldTiles_A_BW");
    // Assign the layers using definitions inside the Tiled editor
    this.belowLayer = this.worldTilemap.createStaticLayer("Below", this.worldTileset, 0, 0);
    this.worldLayer = this.worldTilemap.createStaticLayer("World", this.worldTileset, 0, 0);
    this.aboveLayer = this.worldTilemap.createStaticLayer("Above", this.worldTileset, 0, 0);
    console.debug(this.aboveLayer);
    // Collide with the above player as defined in the Tiled editor
    this.aboveLayer.setCollisionByProperty({collides: true});
    // Spawn at the spawn point setup in Tiled
    this.spawnPointA = this.worldTilemap.findObject("GameObjects", obj => obj.name === "spawnPoint");
    // Controller for the player in the main world
    this.createPlayer();
    // Collision debug
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.aboveLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    // Setup camera
    this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    // Physics bounds
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.setZoom(2);
    // Link line linking each moment/scenes
    let thisText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '1877.').setOrigin(0);
    // Deal with resizing event
    this.scale.on('resize', this.resize, this);
  }

  createPlayer() {
    if(this.controller.scenePlayerLock) {
      return;
    }
    const spawnPointX = 250;
    const spawnPointY = 250;
    const controllerScaleFactor = 0.25;
    this.globalPlayer = new Player(this, spawnPointX, spawnPointY, "hero");
    // Physics bounds
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    this.globalPlayer
    .setCollideWorldBounds(true)
      .setSize(64, 64).setScale(controllerScaleFactor)      
        .setInteractive();
    // Player collision with tiles with collide true
    this.physics.add.collider(this.globalPlayer, this.aboveLayer);
    this.controller.playerCreatedSound.play();
    return this.globalPlayer;
  }

  resize(newGameSize) {
    let width = newGameSize.width;
    let height = newGameSize.height;
    this.cameras.resize(width, height);
  }

  update(time, delta) {
    // If player collides with transition to TownA
    // If player collides with transition to TownB
}