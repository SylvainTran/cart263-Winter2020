//Player's moving state
class PlayerMovingState extends State {
    enter(scene, player) {
      console.log("Player is starting to move");
    }
  
    execute(scene, player) {
      this.updateVelocity(scene, player);
    }
    // Update the velocity directly per case, and animations later on (some issue currently)
    updateVelocity(scene, player) {
      const playerSpeed = player.speed;
      if (player.cursors.left.isDown) {
        player.setVelocityX(-playerSpeed);
        player.play("player-left-walk", true);
      } else if (player.cursors.right.isDown) {
        player.setVelocityX(playerSpeed);
        player.play("player-right-walk", true);
      } else if (player.cursors.up.isDown) {
        player.setVelocityY(-playerSpeed);
        player.play("player-up-walk", true);
      } else if (player.cursors.down.isDown) {
        player.setVelocityY(playerSpeed);
        player.play("player-front-walk", true);
      } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
      }
  
      //If the player didn't move at all, then he is idle
      if (player.body.velocity.equals(new Phaser.Math.Vector2(0, 0))) {
        this.stateMachine.transition("Idle", [scene, player]);
      }
    }
  }
  