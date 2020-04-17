// World
//
// The class that is responsible for rendering the game world's view only (excepted the player's physics)
class World extends Moment {
  constructor(key, controller) {
    super('World');
    this.controller = null;
    this.globalPlayer = null; // The player residing in the World (global scene)
    this.aboveLayer = null; // The layer which has collision objects in it
    this.worldLayer = null; // The layer in which the player and characters can walk
    this.belowLayer = null; // The layer containing decors 
    this.areaConfig = null; // The config object for the state of actors in the game world
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
    this.setupPlayerSpawningPoints();
    // Controller for the player in the main world
    this.createPlayer();
    // Setup actors at spawn points after getting the area config
    const startingArea = 0; // The first "instance" of the world state, because the whole game takes places in a single map
    this.areaConfig = this.controller.areaManager(startingArea);
    // Get the spawn points from the tilemap, by filtering through the Tiled layers
    this.areaConfig.actorSpawningPoints = this.worldTilemap.filterObjects("GameObjects", (obj) => obj.name.includes("actorSpawnPoint"));
    // Use the spawn pool with World as context
    let spawnPool = this.spawnPool();
    spawnPool(this.areaConfig, this);
    // Setup physics bounds
    this.setupPhysics();
    // Setup cameras
    this.setupCameras();
    // Setup text decor in the background
    this.addTextDecor();
    // Handleresizing event
    this.scale.on('resize', this.resize, this);
  }

  // spawnPool
  //
  // Function dealing with actor spawning in the world
  spawnPool = function() {
    // The enclosed function to use the areaConfig data privately
    function spawnPool(data, world) {
      let spawnPoints = [];
      let actors = [];
      // Fill private actors from external data
      for(let i = 0; i < data.nbActors; i++) {
        let d = data.actors[i];
        actors.push(d);
      }      
      // Get spawn points
      function getSpawnPoints() {
        let spawnPoints = data.actorSpawningPoints;
        return spawnPoints;
      }

      let initSpawnPoints = getSpawnPoints();
      // Fill private spawn points from external data
      for(let i = 0; i < initSpawnPoints.length; i++) {
        spawnPoints.push(initSpawnPoints[i]);
      }
      // Spawn actors if there are actors and spawn points
      if(actors.length && spawnPoints.length){
        spawnActors(actors);
      }

      // spawnActors
      //
      // Spawn all actors in the game world
      function spawnActors(actors) {
        for(let i = 0; i < actors.length; i++) {
          // Consume new spawn points randomly for each actor to spawn in the world
          let newSpawnPoint = consumeSpawnPoint();
          let actor = actors[i];
          // The actor is a custom sprite that we created, the world is the context passed down in the function call
          world.add.existing(new actor(world, newSpawnPoint[0].x, newSpawnPoint[0].y));                    
        }
      }  
      // consumeSpawnPoint
      //
      // Gets an available spawn point in the pool of spawn points in the game world. Remove it when an actor is added at that spawn point
      function consumeSpawnPoint() {
        let randomSpawnPoint = Math.floor(Math.random() * spawnPoints.length);
        let consumedSpawnPoint = spawnPoints.splice(randomSpawnPoint, 1);
        // consumedSpawnPoint is an array of a single object containing the random spawn point
        return consumedSpawnPoint;
      }      
    }
    // Return the function for flexible calls
    return spawnPool;
  }

  addTextDecor() {
    const TEXT_OFFSET = 10;
    this.add.text(this.cameras.main.centerX - TEXT_OFFSET, this.cameras.main.centerY, '1877.').setOrigin(0);
  }

  setupPhysics() {
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
  }

  setupPlayerSpawningPoints() {
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