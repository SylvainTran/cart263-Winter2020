/**
 * Dialogue
 * 
 * Handles the dialogue boxes.
 */
class DialogueDisplayer extends Phaser.Scene {
    constructor() {
        super({key:'DialogueDisplayer'});
    }

    // Calls the dialogueFactory for a certain dialogue to return and display
    displayDialogue(node, dialogueKey, dialogueArray, dialogueFactory, context) {
        let d = dialogueArray[dialogueKey][node];
        dialogueFactory.createTextBox(context, 100, 100, {
            wrapWidth: 700,
            fixedWidth: 750,
            fixedHeight: 100,
        }).start(d, 50);
        return d;
    }
}