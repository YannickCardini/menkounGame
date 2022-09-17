import Phaser, { Tilemaps } from 'phaser'
import { Bestiaire, BestiaireConfig } from '~/class/Bestiaire';
import { Bird } from '~/class/Bird';
import { Boar } from '~/class/Boar';
import { Dialog, textAndImg } from '~/class/Dialog';
import { Life } from '~/class/Life';
import { Mushroom } from '~/class/Mushroom';
import { Player } from '~/class/Player';
import { PNJ } from '~/class/PNJ';
import { TweenHelper } from '~/class/TweenHelper';
import { UI } from '~/class/UI';

export default class LevelOne extends Phaser.Scene {

    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Player;
    beasts: Array<Array<Bestiaire>>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    backgrounds: Array<Phaser.GameObjects.Image>;
    static readonly backgroundLayersStart: number = 2;
    static readonly tileSize: number = 32;
    debugPlayerPositionText: Phaser.GameObjects.Text;
    lifes: Array<Life>;
    ui: UI;
    pauseButton: Phaser.GameObjects.Image;
    dialog: Dialog;
    png: PNJ;
    dialogNumber: number;
    ratio: number;


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
        this.load.atlas('cat', 'assets/player.png', 'assets/player.json');
        this.load.atlas('pnj', 'assets/pnj.png', 'assets/pnj.json');
        // mushroom animations
        this.load.atlas('mushroom', 'assets/mushroom.png', 'assets/mushroom.json');
        // disappear animations
        this.load.atlas('disappear', 'assets/disappear.png', 'assets/disappear.json')
        // boar animations
        this.load.atlas('boar', 'assets/boar.png', 'assets/boar.json');
        // bird animations
        this.load.atlas('bird', 'assets/bird.png', 'assets/bird.json');
        // pause game
        this.load.image("pause", "assets/pause_button.png")

        if (!this.sys.game.device.os.desktop) {
            // load button mobile
            this.load.image('slide_button', 'assets/slide_button.png');
            this.load.image('jump_button', 'assets/jump_button.png');
            this.load.image('left_button', 'assets/left_button.png');
            this.load.image('right_button', 'assets/right_button.png')
        }
    }

    create(data: { firstTime: boolean }) {

        let { width } = this.sys.game.canvas;
        this.ratio = width / 620;

        //resize game if screen orientation or other
        // window.addEventListener('resize', this.resize);
        // scene-a #create
        this.events.on('resume', (scene, data) => {
            // @ts-ignore
            this.cameras.main.fadeEffect.alpha = 0;
        });

        // // Create background layers
        this.backgrounds = [];

        for (let i = 11; i > (LevelOne.backgroundLayersStart - 1); i--) {
            let img = this.add.image(0, 0, 'background-' + i).setOrigin(0).setScrollFactor(2 / i, 1);
            img.setScale(LevelOne.tileSize / 64);
            img = this.add.image(img.width * img.scaleX, 0, 'background-' + i).setOrigin(0).setScrollFactor(2 / i, 1);
            img.setScale(LevelOne.tileSize / 64);
            img = this.add.image(img.width * 2 * img.scaleX, 0, 'background-' + i).setOrigin(0).setScrollFactor(2 / i, 1);
            img.setScale(LevelOne.tileSize / 64);
        }


        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
            key: "map",
            tileWidth: LevelOne.tileSize,
            tileHeight: LevelOne.tileSize
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
            x: LevelOne.tileSize * 10,
            y: this.map.heightInPixels - 4 * LevelOne.tileSize,
            state: "moving_right",
            movingRangeX1: LevelOne.tileSize * 7,
            movingRangeX2: LevelOne.tileSize * 14,
            ground: this.groundLayer
        }

        // create the mushroom sprite    
        let mushrooms = [new Mushroom(config), new Mushroom({ scene: this, x: 11 * LevelOne.tileSize, y: this.map.heightInPixels - LevelOne.tileSize * 11, movingRangeX1: 11 * LevelOne.tileSize, movingRangeX2: 15 * LevelOne.tileSize, ground: this.groundLayer })];
        let birds =
            [
                new Bird({ scene: this, x: LevelOne.tileSize * 60, y: LevelOne.tileSize * 10, movingRangeX1: -LevelOne.tileSize * 80, movingRangeX2: LevelOne.tileSize * 60 }),
                new Bird({ scene: this, x: LevelOne.tileSize * 70, y: LevelOne.tileSize * 2, movingRangeX1: -LevelOne.tileSize * 80, movingRangeX2: LevelOne.tileSize * 70 }),
                new Bird({ scene: this, x: LevelOne.tileSize * 80, y: LevelOne.tileSize * 15, movingRangeX1: -LevelOne.tileSize * 80, movingRangeX2: LevelOne.tileSize * 80 }),

            ];
        let boars = [new Boar({ scene: this, x: LevelOne.tileSize * 25, y: LevelOne.tileSize * 16, movingRangeX1: LevelOne.tileSize * 25, movingRangeX2: LevelOne.tileSize * 43, ground: this.groundLayer })];

        this.beasts = [boars, mushrooms, birds];
        // create the player sprite    
        this.player = new Player({ scene: this, x: LevelOne.tileSize * 4, y: this.map.heightInPixels - LevelOne.tileSize * 8 });
        // PNG
        this.png = new PNJ({ scene: this, x: LevelOne.tileSize * 98, y: LevelOne.tileSize * 13 });
        this.png.flipX = true;

        this.lifes = [new Life(this, LevelOne.tileSize * 29.5, LevelOne.tileSize * 1.5), new Life(this, 100, 1100)];

        //  when first time scene called
        if (data.firstTime) {
            this.registry.set('nbrLife', 3);
            this.dialogNumber = 0;
            this.player.x = LevelOne.tileSize;
            this.player.y = this.map.heightInPixels - LevelOne.tileSize * 4;
            this.player.disableControls = true;
            this.player.walk('right');
            this.time.addEvent({
                delay: 2000, callback: () => {
                    this.player.disableControls = false;
                    this.player.setVelocityX(0);
                    this.time.addEvent({ delay: 400, callback: () => { this.startDialogScene() } });
                }
            });
        }

        this.ui = this.add.existing(new UI(this));

        if (!data.firstTime)
            this.ui.lifeBlink();

        config.scene.physics.add.collider(this.groundLayer, this.player);
        config.scene.physics.add.collider(this.groundLayer, this.png);

        //  Add in a new camera, the same size and position as the main camera
        const UICam = this.cameras.add();

        //  The main camera will not render the UI Text objects
        this.cameras.main.ignore(this.ui);

        this.cameras.main.setBounds(LevelOne.tileSize, 0, this.map.widthInPixels - LevelOne.tileSize, this.map.heightInPixels);
        console.log(this.children.list[0].constructor.name))
        UICam.ignore(this.children.list.filter((child: Phaser.GameObjects.GameObject) => !(child instanceof UI)));

        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.zoomTo(this.ratio, 1000, 'Linear', false);
        this.cameras.main.fadeIn(2000);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#99daf6');

    }

    update(): void {
        // console.log(this.player.x, this.player.y)
        console.log(this.input.x, this.input.y)

        this.player.update();

        if (this.player.state !== "dying") {
            this.png.update();
            this.lifes.forEach(life => { life.update(this.player); });
            this.beasts.forEach(beasts => {
                for (let beast of beasts)
                    beast.update()
            });
            this.playerCollide();
            if (this.player.y > LevelOne.tileSize * 20 + this.player.height)
                this.playerDie();
            if (this.player.x > LevelOne.tileSize * 95 && (this.player.body as Phaser.Physics.Arcade.Body).onFloor() && this.dialogNumber < 4)
                this.startDialogScene();
        }
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

    playerDie(): void {
        this.cameras.main.fadeOut(2000);
        this.registry.events.off('changedata');
        this.player.die();
        this.beasts.forEach(beasts => {
            beasts.forEach(beast => beast.playerDie())
        })
        let nbrLife = this.registry.get('nbrLife') - 1;
        this.registry.set('nbrLife', nbrLife)

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.events.removeListener('jumpPressed');
            this.events.removeListener('slidePressed');
            this.events.removeListener('leftPressed');
            this.events.removeListener('rightPressed');

            if (nbrLife < 0)
                this.scene.start('menu');
            else {
                this.scene.restart({ firstTime: false });
            }
        })
    }

    // resize(): void {
    //     var canvas = this.game.canvas, width = window.innerWidth, height = window.innerHeight;
    //     var wratio = width / height, ratio = canvas.width / canvas.height;
    //     if (wratio < ratio) {
    //         canvas.style.width = width + "px";
    //         canvas.style.height = (width / ratio) + "px";
    //     } else {
    //         canvas.style.width = (height * ratio) + "px";
    //         canvas.style.height = height + "px";
    //     }
    // }

    startDialogScene(): void {
        this.dialogNumber++;
        let textsAndImg: Array<textAndImg> = [];
        switch (this.dialogNumber) {
            case 1:
                // @ts-ignore
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause();
                textsAndImg = [
                    { text: "Je hais cette forêt !!!", img: 'player_sad' },
                    { text: "Et particulièrement tous ces horribles animaux ! Il faut que je me dépêche de rejoindre Caporal Coon... ", img: 'player_sad' }
                ]
                this.scene.launch("DialogScene", { textsAndImg: textsAndImg });
                break;

            case 2:
                // @ts-ignore
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause();
                textsAndImg = [
                    { text: "Meine Coon !!! Je suis si heureux d'enfin vous retrouver ! Je vais pouvoir enfin quitter cette maudite nature !", img: 'player_happy' },
                    { text: "Le plaisir est partagé soldat Griffouille, mais hélas vous arrivez trop tôt.", img: 'pnj_serious', flipImg: true },
                    { text: "Aucune mission d'extraction de cette forêt n'est prévue avant mars 2023, on va devoir hélas patienter ici...", img: 'pnj_serious', flipImg: true },
                    { text: "Non Meine Coon ! Je HAIS cette forêt et tous les animaux qui la peuplent !", img: 'player_sad' },
                    { text: "Courage soldat Grifouille, armez-vous de patience.", img: 'pnj_serious', flipImg: true }

                ]
                this.scene.launch("DialogScene", { textsAndImg: textsAndImg });
                break;

            case 3:
                this.cameras.main.fadeOut(2000);
                this.registry.events.off('changedata');
                this.player.disableControls = true;
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('menu');
                })
                break;


            default:
                break;
        }
    }

}
