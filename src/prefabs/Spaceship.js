//spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add to existing scene
        this.points = pointValue; //stor pointValue
        this.moveSpeed = 3;
    }

    update() {
        //move spaceship left
        this.x -= this.moveSpeed;
        //wrap around (this is neat :) )
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    //position reset
    reset() {
        this.x = game.config.width;
    }
}