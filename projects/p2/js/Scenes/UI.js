class UI extends Phaser.Scene {

  constructor() {
    super("UI");
  }

  init(data) {
    console.log("Showing UI");
  }

  preload() {
    //load.image("MoneyEarned", "./assets/images/UI--MoneyEarned.png"); // Too ugly for now
  }

  create(data) {
    // To be updated when player picks up money bags -- Player instructions -- Artefacts of early project
    this.moneyBagsCount = 0;
    this.moneyBagCounter = this.add.text(10, 10, 'Money Bags In Inventory: 0', {
      fontSize: '16px',
      fill: '#FFFFFF'
    });
    this.add.text(275, 600, 'Press X: To Pick Up', {
      fontSize: '16px',
      fill: '#FFFFFF'
    });
    this.add.text(275, 615, 'Press Z: To Use', {
      fontSize: '16px',
      fill: '#FFFFFF'
    });
  }

  update(time, delta) {
    this.moneyBagCounter.setText(`Money Bags In Inventory: ${this.moneyBagsCount}`);
  }
}
