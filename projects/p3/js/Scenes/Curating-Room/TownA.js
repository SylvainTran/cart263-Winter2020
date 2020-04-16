class TownA extends Area {
	constructor(key, config, controller) {
		super(key, config, controller);
		// Player instance in this world
		this.globalPlayer = null;
		// Spawn point for player teleportation
		this.spawnPoint = null;
		// Footstep sound
		this.footstepSound = null;
	}

	init() {
		console.log('Init Area ' + this.key);
	}

	preload() {

	}

	create() {
		this.setupActors(this.config);
		this.setupCamera();
		this.spawnPoint = this.add.zone(this.circle.x, this.circle.y, 64, 64);
		this.physics.world.setBounds(this.spawnPoint.x, this.spawnPoint.y, this.circle.geom.radius * 2, this.circle.geom.radius * 2);
		this.footstepSound = this.sound.add('footstepWater');
		this.playerCreatedSound = this.sound.add('zap');
	}

	update(time, delta) {
		if (this.globalPlayer) {
			this.globalPlayer.PlayerFSM.step([this, this.globalPlayer]);
		}
		this.momentFSM.step([this.parent, this.parent.getData('moment'), this.controller.getClosestNeighbour()]);
	}
}