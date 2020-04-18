 // Dialogue factory
 //
 // Creates Phaser UI such as dialogue using the rex rainbow ui library
 class DialogueFactory {
     constructor() {
        
     }
     // Mr. Rex Rainbow
     createTextBox(scene, x, y, config) {
         const GetValue = Phaser.Utils.Objects.GetValue;
         let wrapWidth = GetValue(config, 'wrapWidth', 0);
         let fixedWidth = GetValue(config, 'fixedWidth', 0);
         let fixedHeight = GetValue(config, 'fixedHeight', 0);
         let textBox = scene.rexUI.add.textBox({
                 x: x,
                 y: y,
                 background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK)
                     .setStrokeStyle(2, COLOR_LIGHT),
                 text: scene.getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
                 action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
                 space: {
                     left: 20,
                     right: 20,
                     top: 20,
                     bottom: 20,
                     icon: 10,
                     text: 10,
                 }
             })
             .setOrigin(0)
             .layout();
         textBox
             .setInteractive()
             .on('pointerdown', function () {
                 let icon = this.getElement('action').setVisible(false);
                 this.resetChildVisibleState(icon);
                 if (this.isTyping) {
                     this.stop(true);
                 } else {
                     this.typeNextPage();
                 }
             }, textBox)
             .on('pageend', function () {
                 if (this.isLastPage) {
                    scene.scene.manager.getScene('UI').dialogueLock = false;
                    setTimeout( () => { this.destroy() }, 3000);
                    return;
                 }
                 let icon = this.getElement('action').setVisible(true);
                 this.resetChildVisibleState(icon);
                 icon.y -= 30;
                 let tween = scene.tweens.add({
                     targets: icon,
                     y: '+=30',
                     ease: 'Bounce',
                     duration: 500,
                     repeat: 0,
                     yoyo: false
                 });
             }, textBox);
         return textBox;
     }
     // Mr. Rex Rainbow
     getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight) {
         return scene.add.text(0, 0, '', {
                 fontSize: '20px',
                 wordWrap: {
                     width: wrapWidth
                 },
                 maxLines: 3
             })
             .setFixedSize(fixedWidth, fixedHeight);
     }
     // Mr. Rex Rainbow
     getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
         return scene.rexUI.add.BBCodeText(0, 0, '', {
             fixedWidth: fixedWidth,
             fixedHeight: fixedHeight,

             fontSize: '20px',
             wrap: {
                 mode: 'word',
                 width: wrapWidth
             },
             maxLines: 3
         })
    }
}