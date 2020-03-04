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
        this.load.atlas('ley', './assets/images/spritesheets/ley/leySpritesheet.png', './assets/images/spritesheets/ley/leySpritesheet.json');
        // Tileset and maps
        this.load.image("tilesA", "./assets/tilesets/tilesetA.png");
        this.load.tilemapTiledJSON("map", "./assets/tilemaps/world-of-youtube.json");
        this.load.tilemapTiledJSON("youtubeStudioMap", "./assets/tilemaps/dank-youtube-studio.json");
    }

    create ()
    {        
        //Animations (atlas version - weird bug currently)
        this.anims.create({
            key: 'ley-left-walk',
            frames: this.anims.generateFrameNames('ley', { prefix: 'ley-left-walk.', start: 0, end: 8, zeroPad: 2, suffix:'.png' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'ley-front-walk',
            frames: this.anims.generateFrameNames('ley', { prefix: 'ley-front-walk.', start: 0, end: 2, zeroPad: 2, suffix:'.png'}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'ley-right-walk',
            frames: this.anims.generateFrameNames('ley', { prefix: 'ley-right-walk.', start: 0, end: 2, zeroPad: 2, suffix:'.png'}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'ley-up-walk',
            frames: this.anims.generateFrameNames('ley', { prefix: 'ley-up-walk.', start: 0, end: 2, zeroPad: 2, suffix:'.png' }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.start('YoutubeLounge');
    }

    update(time, delta)
    {

    }
}
