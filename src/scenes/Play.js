class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load sprites and images
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        //this.load.atlas('spaceshipanim', './assets/spaceshipanim.png', './assets/spaceshipanim.json');
        this.load.image('nightsky', './assets/nightsky.png');

        this.load.image('clouds', './assets/clouds.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        this.load.image('smallship', './assets/smallship.png');
    }

    create() {
        this.sound.play('background_music');
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'nightsky').setOrigin(0, 0);

        this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);

        //make background greeen
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        //add white borders (on each side)
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //add rocket p1
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0); //.play(fly);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0); //.play(fly);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0); //.play(fly);

        this.ship04 = new Smallship(this, game.config.width + borderUISize*6, borderUISize*4, 'smallship', 0, 40).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //https://www.youtube.com/watch?v=ffemDAdJySU
        /*
        this.anims.create({
            key: 'fly',
            frames: [
                {key: 'spaceshipanim', frame: "spaceshipanim1.png" },
                {key: 'spaceshipanim2', frame: "spaceshipanim2.png" },
                {key: 'spaceshipanim3', frame: "spaceshipanim3.png" },
                {key: 'spaceshipanim4', frame: "spaceshipanim4.png" },
                {key: 'spaceshipanim5', frame: "spaceshipanim5.png" },
                {key: 'spaceshipanim6', frame: "spaceshipanim6.png" },
                {key: 'spaceshipanim7', frame: "spaceshipanim7.png" },
                {key: 'spaceshipanim8', frame: "spaceshipanim8.png" },
                {key: 'spaceshipanim9', frame: "spaceshipanim9.png" },
            ], 
            frameRate: 10,
            repeat: -1
        });
        */

        //initialize score
        this.p1Score = 0;
        //display score
        let scoreConfig = {
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
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //'GAME OVER' flag
        this.gameOver = false;

        //play timer
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.playTimer = this.add.text(game.config.width/2, borderUISize + borderPadding*2, this.clock, scoreConfig);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        this.clouds.tilePositionX -= 2;

        //to get remaining time in clock
        this.playTimer.text = Math.floor((this.clock.getRemaining()/1000));

        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    
            ship.reset();                         
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;      

        //I was going to create an array, push each explosion sound to the array, and use math.random to play a random sound
        //it worked, but took a lot of code - Anna Schult showed me a way to do it with less code so I used that instead :)
        this.sound.play("sfx_exp" + Phaser.Math.Between(1, 4));
    }
}
