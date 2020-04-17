// NPC
//
// NPCs
class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y);
        this.setPosition(x, y);
        this.setInteractive();
        this.name = name;
        // The mind space that pop ups on top of a NPC
        this.mindSpaceForm = null;
    }

    // getName
    //
    // gets this NPC's name
    getName() {
        return this.name;
    }

    // setName
    //
    // sets this NPC's name if there is a name to set
    setName(value) {
        if(value !== null) {
            this.name = value;
        }
        return this;
    }

    // talk
    //
    // Talk to this NPC 
    talk(scene) {
        console.log("Talking to: " + this.getName());
        // Also create a mind space form above the NPC's head if there isn't one yet
        if(!this.mindSpaceForm) {
            this.mindSpaceForm = scene.add.existing(new MindSpaceForm(scene, this.x, this.y, this));
            this.mindSpaceForm.setScale(0.5);
            // Setup drag mechanics and physics
            scene.input.setDraggable(this.mindSpaceForm);
            scene.physics.world.enable([this.mindSpaceForm]);
            this.mindSpaceForm.body.setCollideWorldBounds(true);
        }
    }
}