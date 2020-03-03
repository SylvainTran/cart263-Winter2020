class Preloader extends Phaser.Scene {

    constructor () {
        super('preloader');
    }

    init()
    {

    }

    preload ()
    {
        this.load.image("automata", "./assets/images/automata.png");
        this.load.image("YoutubeDirtPile", "./assets/images/sprites/YoutubeDirtPile.png");
        this.load.spritesheet("ley", "./assets/images/spritesheets/ley.png", { frameWidth: 64, frameHeight: 64 });
        // Tileset and maps
        this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
        this.load.tilemapTiledJSON("map", "./assets/tilemaps/world-of-youtube.json");
        this.load.tilemapTiledJSON("youtubeStudioMap", "./assets/tilemaps/dank-youtube-studio.json");
    }

    create ()
    {
        this.scene.start('YoutubeLounge');
    }

    update(time, delta)
    {

    }
}
