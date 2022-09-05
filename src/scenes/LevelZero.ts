import Phaser, { Physics, Tilemaps } from 'phaser'
import { TweenHelper } from '~/utils/TweenHelper';

export default class LevelZero extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Physics.Arcade.Sprite;
    static readonly SCALE: number = 0.5;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    static readonly VELOCITY: number = 200;
    static readonly backgroundLayersStart: number = 4;
    downKey: Phaser.Input.Keyboard.Key;
    nbrLife: number;
    debugPlayerPositionText: Phaser.GameObjects.Text;

    constructor() {
        super('hello-world');
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/assets/tiled/level0.json')
        // tiles in spritesheet 
        this.load.image('cube', 'assets/tiled/cube.png');
        //Background Layers
        for (let i = LevelZero.backgroundLayersStart; i < 12; i++) 
            this.load.image('background-'+i,"assets/background/background-"+i+".png");
            
        // life info
        this.load.image("life", "assets/life.png")
        // player animations
        this.load.atlas('cat', 'assets/cat-0.png', 'assets/cat.json');
        // Decorations
        this.load.image('decor', 'assets/decor.png');
    }

    create(data: {notFirst: boolean; life: number;}) {

        // // Create background layers
        for (let i = 11; i > (LevelZero.backgroundLayersStart-1) ; i--) 
            this.add.image(1018,1040,'background-'+i).setScrollFactor(2/i,1);

        // Create decorations
        this.add.image(485, 1060, 'decor');

        // Add life counter at the top left corner
        this.createLifeStatus(data);

        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
            key: "map",
            tileWidth: 32,
            tileHeight: 32
        };
        // load the map
        this.map = this.make.tilemap(tilemapConfig);
        
        // tiles for the ground layer
        const groundTiles = this.map.addTilesetImage('cube');
        // create the ground layer
        this.groundLayer = this.map.createLayer('platform', groundTiles);

        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        // create the player sprite    
        this.player = this.physics.add.sprite(200, 700, 'cat').setScale(LevelZero.SCALE);

        // this.player.setBounce(0.2); // our player will bounce from items
        // this.player.setCollideWorldBounds(true); // don't go out of the map

        this.physics.add.collider(this.groundLayer, this.player);

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(32, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#99daf6');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_walk', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_idle', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_run', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "slide",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_slide', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_jump', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })

        this.anims.create({
            key: "dead",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_dead', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 7,
        })

        this.anims.create({
            key: "fall",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_fall', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })

        this.time.addEvent({ delay: 500, callback: this.delayDone, callbackScope: this, loop: false })
        this.debugPlayerPositionText = this.add.text(30,30,this.player.x + " , " + this.player.y).setScrollFactor(0)
    }

    delayDone(): void {
        this.player.body.setSize(this.player.width - 80, this.player.height - 3, true);
    }

    updatePlayerPositionText(x: number, y: number): void{
        this.debugPlayerPositionText.setText("x: "+x+" , y:"+y);
    }

    stopSliding(): void {
        this.player.state = "";
        this.player.setAccelerationX(0);
    }

    createLifeStatus(data: {life: number, notFirst: boolean}) {
        this.nbrLife = data.life !== undefined ? data.life : 3;
        const lifeImg = this.add.image(20, 20, 'life').setScrollFactor(0);
        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: "12pt Courier", color: "#ffb000", strokeThickness: 1, stroke: "#000000" }
        const lifeText = this.add.text(35, 12, "x" + this.nbrLife.toString(), style).setScrollFactor(0);
        if (data.notFirst) {
            TweenHelper.flashElement(this, lifeText);
            TweenHelper.flashElement(this, lifeImg);
        }
    }

    update(): void {
        this.updatePlayerPositionText(this.player.x,this.player.y)
        if (this.player.y > 1280)
            this.scene.restart({ life: this.nbrLife - 1, notFirst: true });
        else if (this.player.state === "sliding") {
            this.player.anims.play("slide", true);
            if (this.player.flipX)
                this.player.setVelocityX(-LevelZero.VELOCITY)
            else
                this.player.setVelocityX(LevelZero.VELOCITY)
        }
        else if (this.player.body.velocity.y > 0) {
            this.player.anims.play('fall', true);
        }
        else if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.setVelocityY(-400); // jump up
            this.player.anims.play('jump', true);
        }
        else if (Phaser.Input.Keyboard.JustDown(this.downKey) && this.player.body.onFloor()) {
            this.player.state = "sliding";
            this.time.addEvent({ delay: 400, callback: this.stopSliding, callbackScope: this, loop: false })
        }
        else if (this.cursors.left.isDown) // if the left arrow key is down
        {
            this.player.setVelocityX(-LevelZero.VELOCITY); // move left
            console.log(this.player.getBounds());

            if (this.player.body.onFloor())
                this.player.anims.play('run', true); // play run animation
            this.player.flipX = true; // flip the sprite to the left
        }
        else if (this.cursors.right.isDown) // if the right arrow key is down
        {
            this.player.setVelocityX(LevelZero.VELOCITY); // move right
            if (this.player.body.onFloor())
                this.player.anims.play('run', true); // play run animatio
            this.player.flipX = false; // use the original sprite looking to    the right
        }
        else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor())
                this.player.anims.play('idle', true)

        }


    }
}
