
// Player states
class PlayerIdleState extends State {
    enter(scene, player) {
      console.log("Player is Idle");
    }
  
    execute(scene, player) {
      if (this.checkMovement(player)) {
        this.stateMachine.transition("Moving", [scene, player]);
      }
    }
    //Check the movement per the cursors object
    checkMovement(player) {
      if (player.cursors.left.isDown || player.cursors.right.isDown || player.cursors.up.isDown || player.cursors.down.isDown) {
        return true;
      } else {
        return false;
      }
    }
  }  