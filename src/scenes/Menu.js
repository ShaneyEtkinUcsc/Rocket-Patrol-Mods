class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        //load audio
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        //this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/assets_rocket_shot.wav');

        this.load.audio('sfx_exp1', './assets/Explosion (sound effect).wav');
        this.load.audio('sfx_exp2', './assets/hq-explosion-6288.wav');
        this.load.audio('sfx_exp3', './assets/mixkit-arcade-chiptune-explosion-1691.wav');
        this.load.audio('sfx_exp4', './assets/mixkit-arcade-game-explosion-2759.wav');

        this.load.audio('background_music', './assets/103180816-ambient-chill-out-funk-evening.wav');
        this.load.image('sky', './assets/sky.png');
    }

    create() {
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);

        //menu text config
        let menuConfig = {
            fontFamily: 'Pacifico',
            fontSize: '28px',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        menuConfig.color = '#5424f0';
        //menuConfig.fontSize = '40px';
        this.add.text(game.config.width/2, borderUISize + borderPadding*2, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        //menuConfig.fontSize = '28px';
        menuConfig.fontFamily = 'GreatVibes';
        this.add.text(game.config.width/2, game.config.height/2, 'Use <--> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        //menuConfig.fontSize = '28px';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                smallshipSpeed: 4,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                smallshipSpeed:5,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}
