// NPC
//
// NPCs
class NPC extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y);
        this.setPosition(x, y);
        this.setInteractive();
        this.name = name;
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
    talk() {
        console.log("Talking to: " + this.getName());
    }
}