import Phaser, { Physics, Tilemaps } from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Physics.Arcade.Sprite;
    static readonly SCALE: number = 4/7;
    

    constructor() {
        super('hello-world');
    }

    preload() {
        // // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        // // tiles in spritesheet 
        this.load.image('tiles', 'assets/tiles.png');
        // // simple coin image
        // this.load.image('coin', 'assets/coinGold.png');
        // // player animations
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

    }

    update(time: number, delta: number): void {

    }
}
