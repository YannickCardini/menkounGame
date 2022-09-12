import Phaser, { Tilemaps } from 'phaser'
import { Bestiaire, BestiaireConfig } from '~/class/Bestiaire';
import { Bird } from '~/class/Bird';
import { Boar } from '~/class/Boar';
import { Life } from '~/class/Life';
import { Mushroom } from '~/class/Mushroom';
import { Player } from '~/class/Player';
import { TweenHelper } from '~/class/TweenHelper';

export default class LevelZero extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Player;
    beasts: Array<Array<Bestiaire>>;
    // static readonly SCALE: number = 0.5;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    static readonly backgroundLayersStart: number = 4;
    debugPlayerPositionText: Phaser.GameObjects.Text;
    lifes: Array<Life>;
    lifeImg: Phaser.GameObjects.Image;
    lifeText: Phaser.GameObjects.Text;


    constructor() {
        super('LevelZero');
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/assets/tiled/level0.json')
        // tiles in spritesheet 
        this.load.image('TX Tileset Ground', 'assets/tiled/TX Tileset Ground.png');
        //Background Layers
        for (let i = LevelZero.backgroundLayersStart; i < 12; i++)
            this.load.image('background-' + i, "assets/background/background-" + i + ".png");
        // life info
        this.load.image("life", "assets/life.png")
        // player animations
        this.load.atlas('cat', 'assets/cat-0.png', 'assets/cat.json');
        // mushroom animations
        this.load.atlas('mushroom', 'assets/mushroom.png', 'assets/mushroom.json');
        // disappear animations
        this.load.atlas('disappear', 'assets/disappear.png', 'assets/disappear.json')
        // boar animations
        this.load.atlas('boar', 'assets/boar.png', 'assets/boar.json');
        // bird animations
        this.load.atlas('bird', 'assets/bird.png', 'assets/bird.json');
        // Decorations
        this.load.image('decor', 'assets/decor.png');
    }

    create(data: { skipRegistry: boolean }) {

        //  Create the nbr of life in the Registry if first time
        if (data.skipRegistry === undefined) {
            this.registry.set('nbrLife', 3);
        }
        // // Create background layers
        for (let i = 11; i > (LevelZero.backgroundLayersStart - 1); i--)
            this.add.image(1018, 1040, 'background-' + i).setScrollFactor(2 / i, 1);

        // Create decorations
        this.add.image(1030, 736, 'decor');

        // Add life counter at the top left corner
        this.registry.events.on('changedata', this.updateLifeStatus, this);

        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
            key: "map",
            tileWidth: 32,
            tileHeight: 32
        };
        // load the map
        this.map = this.make.tilemap(tilemapConfig);

        // tiles for the ground layer
        const groundTiles = this.map.addTilesetImage('TX Tileset Ground');
        // create the ground layer
        this.groundLayer = this.map.createLayer('platform', groundTiles);

        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        let config: BestiaireConfig = {
            scene: this,
            x: 730,
            y: 1055,
            state: "moving_right",
            movingRangeX1: 600,
            movingRangeX2: 900,
            ground: this.groundLayer
        }

        // create the mushroom sprite    
        let mushrooms = [new Mushroom(config), new Mushroom({ scene: this, x: 3000, y: 1100, movingRangeX1: 200, movingRangeX2: 430, ground: this.groundLayer })];
        let birds = [new Bird({ scene: this, x: 900, y: 1050, movingRangeX1: -500, movingRangeX2: 900 })];
        let boars = [new Boar({ scene: this, x: 300, y: 1000, movingRangeX1: 200, movingRangeX2: 400, ground: this.groundLayer })];

        this.beasts = [boars,mushrooms,birds];
        // create the player sprite    
        this.player = new Player({ scene: this, x: 100, y: 1000 });

        config.scene.physics.add.collider(this.groundLayer, this.player);

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(32, 0, this.map.widthInPixels - 64, this.map.heightInPixels - 96);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.fadeIn(2000);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#99daf6');

        this.lifes = [new Life(this, 300, 1000), new Life(this, 100, 1100)]

        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: "12pt Courier", color: "#ffb000", strokeThickness: 1, stroke: "#000000" }
        this.lifeImg = this.add.image(20, 20, 'life').setScrollFactor(0).setScale(0.3);
        this.lifeText = this.add.text(35, 12, "x" + this.registry.get('nbrLife').toString(), style).setScrollFactor(0);
        if (data.skipRegistry !== undefined) {
            TweenHelper.flashElement(this, this.lifeText);
            TweenHelper.flashElement(this, this.lifeImg);
        }
    }

    update(): void {
        this.player.update();
        if (this.player.state !== "dying") {
            this.lifes.forEach(life => { life.update(this.player); });
            this.beasts.forEach(beasts => {
                for (let beast of beasts)
                    beast.update()
            });
            this.playerCollide();
            if (this.player.y > 1280)
                this.playerDie();
        }
    }

    playerDie(): void {
        this.cameras.main.fadeOut(2000);
        this.registry.events.off('changedata');
        this.player.die();
        this.beasts.forEach(beasts => {
            beasts.forEach(beast => beast.playerDie())
        })
        let nbrLife = this.registry.get('nbrLife');
        this.registry.set('nbrLife', nbrLife - 1)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {

            if (nbrLife < 0)
                this.scene.start('menu');
            else {
                this.scene.restart({ skipRegistry: true });
            }
        })
    }

    updateLifeStatus(parent, key, data) {
        this.lifeText.setText("x" + data.toString());
        TweenHelper.flashElement(this, this.lifeText);
        TweenHelper.flashElement(this, this.lifeImg);;
    }

    playerCollide(): void {
        for (let j = 0; j < this.beasts.length; j++) {
            const beasts = this.beasts[j];
            for (let i = 0; i < beasts.length; i++) {
                const beast = beasts[i];
                // handling collision between enemy and hero
                if (beast.state !== "dying" && beast.state !== "dead")
                    this.physics.world.collide(this.player, beast, (hero) => {
                        if (beast.body.touching.up && hero.body.touching.down) {
                            if (beast instanceof Mushroom) {
                                this.player.setVelocityY(-500);
                                beast.jumpOnMushroom();
                            }
                            else {
                                this.player.setVelocityY(-280);
                                beast.die('jump');
                            }
                        }
                        else if(beast instanceof Boar && ((beast.body.touching.right && !beast.flipX) || (beast.body.touching.left && beast.flipX))){
                            this.playerDie();
                        }
                        else {
                            if (this.player.state === "sliding")
                                beast.die('slide');
                            else
                                this.playerDie();
                        }
                    });
            }
        }
    }

}

