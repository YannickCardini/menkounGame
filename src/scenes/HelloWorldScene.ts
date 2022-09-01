import Phaser, { Tilemaps } from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;

    constructor(bob: Tilemaps.Tilemap) {
        super('hello-world');
    }

    preload() {
        // // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        // // tiles in spritesheet 
        this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 70, frameHeight: 70 });
        // // simple coin image
        this.load.image('coin', 'assets/coinGold.png');
        // // player animations
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
    }

    create() {
        // load the map
        this.map = this.make.tilemap({ key: 'map' });
        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createBlankLayer('level1', groundTiles, 0, 0);
        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

    }

    update(time: number, delta: number): void {

    }
}
