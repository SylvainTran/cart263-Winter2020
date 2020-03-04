//YoutubeLounge
//
//Philosophical question: Is our world map actually like a Youtube Lounge?
class YoutubeLounge extends Phaser.Scene {

  constructor() {
    super('YoutubeLounge');
  }

  init(data) {

  }

  preload() {

  }

  create() {
    // Tilemap setup
    // Followed tutorial from https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
    // Phaser's built in make tilemap function, uses a key
    const map = this.make.tilemap({
      key: "map"
    });
    // Create the tileset from the map, using our preloaded assets
    const tileset = map.addTilesetImage("tilesetA", "tilesA");
    // Assign the layers using definitions inside the Tiled editor
    const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
    const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);
    // Collide with the above player as defined in the Tiled editor
    aboveLayer.setCollisionByProperty({
      collides: true
    });

    // Collision debug
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // aboveLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    // Spawn at the spawn point setup in Tiled
    const spawnPoint = map.findObject("GameObjects", obj => obj.name === "Spawn Point");
    // Sprite scale factor
    const scaleFactor = 0.3;
    this.youtubePimpPlayer = new YoutubePimpPlayer(this, spawnPoint.x, spawnPoint.y, "ley").setScale(scaleFactor);
    this.youtubePimpPlayer.setCollideWorldBounds(true);
    // Player collision with tiles with collide true
    this.physics.add.collider(this.youtubePimpPlayer, aboveLayer);
    // Physics bounds
    this.physics.world.setBounds(0, 0, 640, 640);

    // Camera follow and zoom
    this.cameras.main.setSize(640, 640);
    this.cameras.main.setBounds(0, 0, 640, 640);
    this.cameras.main.startFollow(this.youtubePimpPlayer, true, 0.05, 0.05);
    this.cameras.main.setZoom(3);

    // Update the main__log div to reflect the state of the game, and later on the commands that we have
    // [In Development: Find spellbooks that will allow you to command youtubers remotely from the underground Youtube Creator Studio.]
    $('.main__log').text("Find the hidden Youtube Creator Studio.");

    this.scene.launch("UI");
    // TODO Launch Youtube channels if player activates the youtube channels in the studio -- Not sure if still going this way
    //this.scene.launch("YoutubeChannelA");
  }

  update(time, delta) {
    // Update the player's FSM
    this.youtubePimpPlayer.PlayerFSM.step();

    //Check if the player is changing maps
    //If so transition to the appropriate map
    //Temporary collision check, could be done more simply with Tiled
    const STAIR_TO_YOUTUBE_STUDIO_POS_X = 501;
    const STAIR_TO_YOUTUBE_STUDIO_POS_Y = 563;
    const OFFSET_X = 5;
    const OFFSET_Y = 5;
    if (Math.floor(this.youtubePimpPlayer.x) >= STAIR_TO_YOUTUBE_STUDIO_POS_X - OFFSET_X &&
      Math.floor(this.youtubePimpPlayer.x) <= STAIR_TO_YOUTUBE_STUDIO_POS_X + OFFSET_X &&
      Math.floor(this.youtubePimpPlayer.y) >= STAIR_TO_YOUTUBE_STUDIO_POS_Y - OFFSET_Y &&
      Math.floor(this.youtubePimpPlayer.y) <= STAIR_TO_YOUTUBE_STUDIO_POS_Y + OFFSET_Y) {
      console.log("Going to the youtube studio");
      this.scene.start("youtubeStudio", {
        player: this.youtubePimpPlayer
      }); // Passing on the player in the data object -- Weird issue right now, not working correctly probably because I'm a noob
      this.scene.remove("YoutubeLounge"); // Remove the scene after that
    }
  }
}
