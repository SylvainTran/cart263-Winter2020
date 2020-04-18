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
    displayDialogue(threadNode, dialogueKey, dialogueArray, dialogueFactory, context) {
        // Return if already in a dialogue
        if(context.dialogueLock) {
            return;
        }
        // Lock the player in the dialogue (reset on last page of pageEnd of textbox)
        context.dialogueLock = true;
        let d = dialogueArray[dialogueKey][threadNode];
        dialogueFactory.createTextBox(context, 50, 50, {
            wrapWidth: 320,
            fixedWidth: 320,
            fixedHeight: 75,
        }).start(d, 50);
        return d;  
    }
}