class YoutubeLounge extends Phaser.Scene {

    constructor () {
        super('YoutubeLounge');
    }

    init(data)
    {

    }

    preload ()
    {

    }

    create ()
    {
        // Tilemap setup
        // Followed tutorial from https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tilesetA", "tilesA");
        const belowLayer = map.createStaticLayer("Below", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Above", tileset, 0, 0);
        aboveLayer.setCollisionByProperty({ collides: true });

        // Collision debug
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        aboveLayer.renderDebug(debugGraphics, {
          tileColor: null, // Color of non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
          faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });

        // Player collision with tiles with collide true
        // Spawn at the spawn point setup in Tiled
        const spawnPoint = map.findObject("GameObjects", obj => obj.name === "Spawn Point");
        // Sprite scale factor
        const scaleFactor = 0.3;
        this.youtubePimpPlayer = new YoutubePimpPlayer(this, spawnPoint.x, spawnPoint.y, "ley").setScale(scaleFactor);
        this.youtubePimpPlayer.setCollideWorldBounds(true);
        this.physics.add.collider(this.youtubePimpPlayer, aboveLayer);
        // Physics bounds
        this.physics.world.setBounds(0, 0, 640, 640);

        // Camera follow and zoom
        this.cameras.main.setSize(640, 640);
        this.cameras.main.setBounds(0, 0, 640, 640);
        this.cameras.main.startFollow(this.youtubePimpPlayer, true, 0.05, 0.05);
        this.cameras.main.setZoom(3);
        
        //$('.side__left-menu__top').text("World of Youtube");
        // Update the main__log div to reflect the commands that we have
        $('.main__log').text("Find the hidden Youtube Studio.");

        // TODO parallel launching with UI and other youtube channels
        this.scene.launch("UI");
        // TODO Launch Youtube channels if player activates the youtube channels in the studio
        //this.scene.launch("YoutubeChannelA");

    }

    update(time, delta)
    {
        this.youtubePimpPlayer.PlayerFSM.step();

        //Check if the player is changing maps
        //If so transition to the appropriate map
        //Temporary collision check, should be done with Tiled
        //console.log("X pos: " + Math.floor(this.youtubePimpPlayer.x));
        //console.log("Y pos: " + Math.floor(this.youtubePimpPlayer.y));
        const STAIR_TO_YOUTUBE_STUDIO_POS_X = 501;
        const STAIR_TO_YOUTUBE_STUDIO_POS_Y = 563;
        const OFFSET_X = 5;
        const OFFSET_Y = 5;
        if(Math.floor(this.youtubePimpPlayer.x) >= STAIR_TO_YOUTUBE_STUDIO_POS_X - OFFSET_X &&
          Math.floor(this.youtubePimpPlayer.x) <= STAIR_TO_YOUTUBE_STUDIO_POS_X + OFFSET_X &&
          Math.floor(this.youtubePimpPlayer.y) >= STAIR_TO_YOUTUBE_STUDIO_POS_Y - OFFSET_Y &&
          Math.floor(this.youtubePimpPlayer.y) <= STAIR_TO_YOUTUBE_STUDIO_POS_Y + OFFSET_Y)
        {
          console.log("Going to the youtube studio");
          //this.youtubePimpPlayer.PlayerFSM.transition("idle");
          this.scene.start("youtubeStudio", { player: this.youtubePimpPlayer });
          this.scene.remove("YoutubeLounge");
        }
    }
}
