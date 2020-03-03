  class Automata extends Person {
    constructor(scene, x, y, avatarKey)
    {
      super(scene, x, y, avatarKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setImmovable(true);
      this.x = x;
      this.y = y;
      this.AutomataFSM = new StateMachine('idle', automataStates, [this, this.player]);
      this.cashInventory = 0; // The automata's cash bag inventory.
      this.financialToleranceThreshold = Math.floor(Math.random() * 100);
      this.id = Math.floor(Math.random() * 1000);
    }

    speak()
    {
      console.log("My serial number is " + this.serialNumber + ". My Current state is: " + this.state);
    }

    getCashInventory() {
        return this.cashInventory;
    }

    setCashInventory(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.inventory += value;
      }
    }

    getFinancialToleranceThreshold() {
        return this.financialToleranceThreshold;
    }

    setFinancialToleranceThreshold(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.financialToleranceThreshold = value;
      }
    }

    getId() {
        return this.id;
    }

    setId(value) {
      if(value >= 0)
      {
        this.id = value;
      }
    }
    // Check bank account
    checkBankAccount() {
      if(cashInventory() >= this.financialToleranceThreshold()){

      }
    }
  }

  function rotateMe() {
    console.log("Rotating - collided!!!!");
    // Animate each automaton
    setTimeout(() => { automatons.getChildren().forEach(automata => {
        automatons.rotate(-Math.PI/8); // 2, 25, 50, 200
        // TODO play laboring animation
        // TODO Sweep up closest dirt pile
    });}, 1000);
  }
