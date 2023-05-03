//rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;

        //add rocket sound effect
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    update() {
        //side movement
        //if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        //}

        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        //if fired move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
            //DISPLAY FIRE TEXT - FOR MOD!!!
            
            let fireConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#2491f0',
                color: '#ffffff',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 100
            }
            this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'FIRE', fireConfig);
            
        }
        //reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    //reset rocket to 'ground'
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
        //HIDE FIRE TEXT - FOR MOD!!!
    }
}