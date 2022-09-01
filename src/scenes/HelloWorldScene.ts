import Phaser, { Physics, Tilemaps } from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: any; //Physics.Arcade.Sprite;
    static readonly SCALE: number = 4 / 7;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;


    constructor() {
        super('hello-world');

    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/assets/map.json')
        // tiles in spritesheet 
        this.load.image('tiles', 'assets/tiles.png');
        // simple coin image
        // this.load.image('coin', 'assets/coinGold.png');
        // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    }

    create() {
        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
            key: "map",
            tileWidth: 70,
            tileHeight: 70
        };
        // load the map
        this.map = this.make.tilemap(tilemapConfig);
        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        console.log(groundTiles)
        // create the ground layer
        this.groundLayer = this.map.createLayer('Monde', groundTiles).setScale(HelloWorldScene.SCALE);

        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        // create the player sprite    
        this.player = this.physics.add.sprite(200, 200, 'player').setScale(HelloWorldScene.SCALE);
        this.player.setBounce(0.2); // our player will bounce from items
        this.player.setCollideWorldBounds(true); // don't go out of the map

        this.physics.add.collider(this.groundLayer, this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff');

        // player walk animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });
        // idle with only one frame, so repeat is not neaded
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'p1_stand' }],
            frameRate: 10,
        });

    }



    update(time: number, delta: number): void {
        if (this.cursors.left.isDown) // if the left arrow key is down
        {
            this.player.body.setVelocityX(-200); // move left
            this.player.anims.play('walk', true); // play walk animation
            this.player.flipX = true; // flip the sprite to the left
        }
        else if (this.cursors.right.isDown) // if the right arrow key is down
        {
            this.player.body.setVelocityX(200); // move right
            this.player.anims.play('walk', true); // play walk animatio
            this.player.flipX = false; // use the original sprite looking to the right
        }
        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.player.body.setVelocityY(-500); // jump up
            this.player.anims.play('idle', true);

        }
    }
}
