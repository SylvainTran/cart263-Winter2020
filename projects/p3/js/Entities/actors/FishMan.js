// FishMan
//
// FishMan NPCs
class FishMan extends NPC {
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.setTexture('p_001');
        this.type = "person";
    }
}