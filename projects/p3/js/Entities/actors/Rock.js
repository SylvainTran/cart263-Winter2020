// Rock
//
// Rock NPCs
class Rock extends NPC {
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.setTexture('i_001');
        this.type = "Rock";
    }
}