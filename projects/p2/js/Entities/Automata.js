//Automata
//
//This class is the one for the keener youtuber NPCs
  class Automata extends Person {
    constructor(scene, x, y, avatarKey)
    {
      super(scene, x, y, avatarKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setImmovable(true);
      this.x = x;
      this.y = y;
      this.AutomataFSM = new StateMachine('idle', automataStates, [scene, this]);
      this.cashInventory = 0; // The automata's cash bag inventory.
      this.financialToleranceThreshold = Math.floor(Math.random() * 100); // between 0-100 will guarantee getting good or bad videos, along with the bank account randomizer that gives 1$ or 101$
      this.id = Math.floor(Math.random() * 1000);
    }
    // Useless test function
    speak()
    {
      console.log("I'm a keener");
    }
    // getCashInventory
    //
    // Return the cash inventory to check for video generation decisions
    getCashInventory() {
        return this.cashInventory;
    }
    // setCashInventory
    //
    // Sets the cash inventory to check for video generation decisions
    setCashInventory(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.inventory += value;
      }
    }
    // getFinancialToleranceThreshold
    //
    // Return the financial tolerance threshold to check for video generation decisions
    getFinancialToleranceThreshold() {
        return this.financialToleranceThreshold;
    }
    // setFinancialToleranceThreshold
    //
    // Sets the financial tolerance threshold to check for video generation decisions
    setFinancialToleranceThreshold(value) {
      if(value) // Could be negative too (on purpose)
      {
        this.financialToleranceThreshold = value;
      }
    }
    // getId
    //
    // Return this automata's ID
    getId() {
        return this.id;
    }
    // setId
    //
    // Sets this automata's ID
    setId(value) {
      if(value >= 0)
      {
        this.id = value;
      }
    }

    // randomizeBankAccount()
    //
    // This is a metaphor for the many impredictable things in life
    randomizeBankAccount() {
      let randomBankAccountCapital = Math.random();
      const MAXIMUM_CASH = 101; // max cash possible for the NPC
      const ONE_DOLLAR = 1; // the one penny
      const CORRUPTION_THRESHOLD = 0.2; // will generate bad youtube videos at this threshold

      if(randomBankAccountCapital <= CORRUPTION_THRESHOLD)
      {
        this.cashInventory = MAXIMUM_CASH;
      }
      else
      {
        this.cashInventory = ONE_DOLLAR;
      }
    }
    // Check bank account
    //
    // if the NPC automata's cash inventory is lower than the tolerance threshold
    // for feeling secure, more likely to creating dirty videos for the sake of money
    // to be extended with cash offers
    checkBankAccount() {
      if(this.getCashInventory() <= this.getFinancialToleranceThreshold() ){
        console.log("Poor enough at the moment, creating dirty video for money");
        return false;
      } else {
        console.log("Secure enough at the moment, creating art");
        return true;
      }
    }
  }
  // Useless test function
  function rotateMe() {
    console.log("Rotating - collided!!!!");
    // Animate each automaton
    setTimeout(() => { automatons.getChildren().forEach(automata => {
        automatons.rotate(-Math.PI/8); // 2, 25, 50, 200
        // TODO play laboring animation
        // TODO Sweep up closest dirt pile
    });}, 1000);
  }
