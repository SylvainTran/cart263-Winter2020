class YoutubeLounge extends Phaser.Scene {

    constructor () {
        super('YoutubeLounge');
    }

    init() 
    {      

    }
    
    preload () 
    {       
        this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
        this.load.tilemapTiledJSON("map", "./assets/tilemaps/world-of-youtube.json");
        this.load.tilemapTiledJSON("dank-youtube-studio-map", "./assets/tilemaps/dank-youtube-studio.json");
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
        this.youtubePimpPlayer = new YoutubePimpPlayer(this, spawnPoint.x, spawnPoint.y, "automata");
        this.youtubePimpPlayer.setCollideWorldBounds(true);
        this.physics.add.collider(this.youtubePimpPlayer, aboveLayer);

        // Test NPC
        this.testAutomata = new Automata({scene:this, x: automataConfig.x, y: automataConfig.y});
        this.testAutomata.speak();
        console.log("In youtube lounge");

        // TODO parallel launching with UI
        this.scene.launch("UI");
    }

    update(time, delta) 
    {
        this.youtubePimpPlayer.PlayerFSM.step();
        this.testAutomata.AutomataFSM.step();
    }
}