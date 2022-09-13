import Phaser, { Tilemaps } from 'phaser'
import { Bestiaire, BestiaireConfig } from '~/class/Bestiaire';
import { Bird } from '~/class/Bird';
import { Boar } from '~/class/Boar';
import { Dialog } from '~/class/Dialog';
import { Life } from '~/class/Life';
import { Mushroom } from '~/class/Mushroom';
import { Player } from '~/class/Player';
import { TweenHelper } from '~/class/TweenHelper';

export default class LevelOne extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Player;
    beasts: Array<Array<Bestiaire>>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    static readonly backgroundLayersStart: number = 2;
    debugPlayerPositionText: Phaser.GameObjects.Text;
    lifes: Array<Life>;
    lifeImg: Phaser.GameObjects.Image;
    lifeText: Phaser.GameObjects.Text;
    backgrounds: Array<Phaser.GameObjects.Image>;


    constructor() {
        super('LevelOne');
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('map', '/assets/tiled/level1.json')
        // tiles in spritesheet 
        this.load.image('TX Tileset Ground', 'assets/tiled/TX Tileset Ground.png');
        //Background Layers
        for (let i = LevelOne.backgroundLayersStart; i < 12; i++)
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

        if (!this.sys.game.device.os.desktop) {
            // load button mobile
            this.load.image('slide_button', 'assets/slide_button.png');
            this.load.image('jump_button', 'assets/jump_button.png');
            this.load.image('left_button', 'assets/left_button.png');
            this.load.image('right_button', 'assets/right_button.png')
            this.load.image('fullScreen_button', 'assets/fullScreen_button.png')
        }
    }

    create(data: { skipRegistry: boolean }) {

        //resize game if screen orientation or other
        window.addEventListener('resize', this.resize);
        this.resize();


        //  Create the nbr of life in the Registry if first time
        if (data.skipRegistry === undefined) {
            this.registry.set('nbrLife', 3);
        }
        // // Create background layers
        for (let i = 11; i > (LevelOne.backgroundLayersStart - 1); i--) {
            this.add.image(0, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);
            this.add.image(1024, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);
            // this.add.image(2048, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);


        }

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
        this.groundLayer = this.map.createLayer('Tile Layer 1', groundTiles);

        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        let config: BestiaireConfig = {
            scene: this,
            x: 523,
            y: 500,
            state: "moving_right",
            movingRangeX1: 220,
            movingRangeX2: 540,
            ground: this.groundLayer
        }

        // create the mushroom sprite    
        let mushrooms = [new Mushroom(config), new Mushroom({ scene: this, x: 350, y: 290, movingRangeX1: 350, movingRangeX2: 480, ground: this.groundLayer })];
        let birds =
            [
                new Bird({ scene: this, x: 1900, y: 500, movingRangeX1: -100, movingRangeX2: 2900 }),
                new Bird({ scene: this, x: 1900, y: 400, movingRangeX1: -100, movingRangeX2: 2000 }),
                new Bird({ scene: this, x: 1400, y: 50, movingRangeX1: -100, movingRangeX2: 1900 }),

            ];
        let boars = [new Boar({ scene: this, x: 1300, y: 500, movingRangeX1: 800, movingRangeX2: 1350, ground: this.groundLayer })];

        this.beasts = [boars, mushrooms, birds];
        // create the player sprite    
        this.player = new Player({ scene: this, x: 100, y: 300 });

        config.scene.physics.add.collider(this.groundLayer, this.player);

        // set bounds so the camera won't go outside the game world
        let heightInPixels = this.map.heightInPixels - 64;
        // if (!this.sys.game.device.os.desktop)
            heightInPixels = this.map.heightInPixels;
        this.cameras.main.setBounds(32, 0, this.map.widthInPixels - 32, heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.fadeIn(2000);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#99daf6');

        this.lifes = [new Life(this, 960, 45), new Life(this, 100, 1100)];

        const style: Phaser.Types.GameObjects.Text.TextStyle = { font: "12pt Courier", color: "#ffb000", strokeThickness: 1, stroke: "#000000" }
        this.lifeImg = this.add.image(20, 20, 'life').setScrollFactor(0).setScale(0.3);
        this.lifeText = this.add.text(35, 12, "x" + this.registry.get('nbrLife').toString(), style).setScrollFactor(0);
        if (data.skipRegistry !== undefined) {
            TweenHelper.flashElement(this, this.lifeText);
            TweenHelper.flashElement(this, this.lifeImg);
        }

        let dia = new Dialog(this,{windowHeight: 70, padding: 12, dialogSpeed: 4});
        dia.setText("'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore etfdsssqsdf fqsd f fsg s arez  cxtft ytry pokpoe paojzprez  ezapoofoi  dolore magna aliqua.'",true)


    }

    update(): void {
        this.player.update();
        console.log(this.player.x, this.player.y)

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

    resize(): void {
        var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
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
                                this.player.setVelocityY(-600);
                                beast.jumpOnMushroom();
                            }
                            else {
                                this.player.setVelocityY(-280);
                                beast.die('jump');
                            }
                        }
                        else if (beast instanceof Boar && ((beast.body.touching.right && !beast.flipX) || (beast.body.touching.left && beast.flipX))) {
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
