// QuestionnaireBoss
//
// QuestionnaireBoss NPC
class QuestionnaireBoss extends NPC {
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.setTexture('questionnaireBoss');
        this.type = 'questionnaireBoss';
        this.questState = 0; // Flag to track whether to assign or not new questionnaires to the player
    }
}