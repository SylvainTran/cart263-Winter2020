class Area extends Phaser.Scene {
    constructor(key, config, controller) {
        super(key);
        this.config = config;
        this.controller = controller;
        // Player instance in this world
        this.globalPlayer = null;
        // Spawn point for player teleportation
        this.spawnPoint = null;
        // Footstep sound
        this.footstepSound = null;
    }

    // When the Global Player enters this scene's (dimension), then an instance of the player of this scene is rendered
    // and enabled for keyboard input
    initPlayer() {
        this.globalPlayer = this.createPlayer();
    }

    createPlayer() {
        if (this.globalPlayer) {
            let thisPlayer = this.globalPlayer;
            thisPlayer.destroy(true);
        }
        // Set global player to null
        this.controller.World.globalPlayer = undefined;
        // Lock the player as unique in the Controller
        this.controller.scenePlayerLock = true;
        // Spawn the player in the resized scene
        const sceneScaleFactor = 1;
        this.globalPlayer = new Player(this, this.spawnPoint.x + this.circle.geom.radius, this.spawnPoint.y + this.circle.geom.radius, "hero");
        this.globalPlayer.setSize(64, 64).setScale(sceneScaleFactor);
        this.globalPlayer.setCollideWorldBounds(true);
        // Camera follow
        // this.cameras.main.startFollow(this.globalPlayer, true, 0.05, 0.05);
        this.cameras.main.setZoom(2);
        return this.globalPlayer;
    }

    destroyPlayer() {
        let thisPlayer = this.globalPlayer;
        thisPlayer.destroy(true);
        this.globalPlayer = null;
    }

    //setupCamera()
    //@args: none
    //setup the camera positions, size and scroll view
    setupCamera() {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.cameras.main.setScroll(this.parent.x, this.parent.y, GoodNPCPunchLine.WIDTH, GoodNPCPunchLine.HEIGHT);
    }

    setupActors(config) {
        // Get the current area's config and use it to create actors
        const nbActors = config.nbActors;
        const actors = config.actors;

        this.createActors(areaConfig);
        // Create actors for the current area
        const actorsInArea;
        return actorsInArea;
    }
}