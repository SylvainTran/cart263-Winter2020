class World extends Moment {
  constructor(key, controller) {
    super('World');
    this.controller = null;
    this.globalPlayer = null; // The player residing in the World (global scene)
    this.aboveLayer = null; // The layer which has collision objects in it
    this.worldLayer = null; // The layer in which the player and characters can walk
    this.belowLayer = null; // The layer containing decors 
  }

  init() {
    this.controller = this.scene.manager.getScene('Controller');
  }

  preload() {

  }

  create() {
    // Create the game world's tilemap
    this.setupWorldTiles();
    // Spawn at the spawn point setup in Tiled
    this.setupSpawningPoints();
    // Controller for the player in the main world
    this.createPlayer();
    // Setup physics bounds
    this.setupPhysics();
    // Setup cameras
    this.setupCameras();
    // Setup text decor in the background
    this.addTextDecor();
    // Handleresizing event
    this.scale.on('resize', this.resize, this);
  }

  addTextDecor() {
    const TEXT_OFFSET = 10;
    this.add.text(this.cameras.main.centerX - TEXT_OFFSET, this.cameras.main.centerY, '1877.').setOrigin(0);
  }

  setupPhysics() {
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
  }

  setupSpawningPoints() {
    this.spawnPointA = this.worldTilemap.findObject("GameObjects", obj => obj.name === "spawnPoint");
  }

  setupCameras() {
    this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
    this.cameras.main.setZoom(2);
  }

  setupWorldTiles() {
    this.worldTilemap = this.make.tilemap({ key: "world" });
    // Create the tileset from the map, using our preloaded assets
    this.worldTileset = this.worldTilemap.addTilesetImage("world-bw", "worldTiles_A_BW");
    // Assign the layers using definitions inside the Tiled editor
    this.belowLayer = this.worldTilemap.createStaticLayer("Below", this.worldTileset, 0, 0);
    this.worldLayer = this.worldTilemap.createStaticLayer("World", this.worldTileset, 0, 0);
    this.aboveLayer = this.worldTilemap.createStaticLayer("Above", this.worldTileset, 0, 0);
    // Collide with the above player as defined in the Tiled editor
    this.aboveLayer.setCollisionByProperty({ collides: true });
    // Collision debug
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.aboveLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
  }

  // createPlayer
  //
  // Creates and returns a player when called from the controller due to a level start or another player spawning event
  createPlayer() {
    // Return if the player is scene locked due to some game event
    if(this.controller.scenePlayerLock) {
      return;
    }
    // Scale at which the player will be reduced in this world
    const controllerScaleFactor = 0.25;
    // Instantiate the player at the spawn point
    this.globalPlayer = new Player(this, this.spawnPointA.x, this.spawnPointA.y, "hero");
    // Physics bounds
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    // Setup the player's size, scale, interactivity
    this.globalPlayer
    .setCollideWorldBounds(true)
      .setSize(64, 64).setScale(controllerScaleFactor)      
        .setInteractive();
    // Player collision with tiles with collide true
    this.physics.add.collider(this.globalPlayer, this.aboveLayer);
    // Play player created sound
    this.controller.playerCreatedSound.play();
    return this.globalPlayer;
  }

  // resize
  // 
  // Resizes the game's width and height of cameras
  resize(newGameSize) {
    let width = newGameSize.width;
    let height = newGameSize.height;
    this.cameras.resize(width, height);
  }

  update(time, delta) {

  }
}