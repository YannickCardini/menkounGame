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
    pauseButton: Phaser.GameObjects.Image;
    dialog: Dialog;
    png: PNJ;
    dialogNumber: number;

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

    create(data: { skipRegistry: boolean }) {

        //resize game if screen orientation or other
        window.addEventListener('resize', this.resize);
        // scene-a #create
        this.events.on('resume', (scene, data) => {
            this.cameras.main.fadeEffect.alpha = 0;
        });

        this.dialogNumber = 0;

        // Add life counter at the top left corner
        this.registry.events.on('changedata', this.registryEvents, this);

        // // Create background layers
        for (let i = 11; i > (LevelOne.backgroundLayersStart - 1); i--) {
            this.add.image(0, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);
            this.add.image(1024, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);
            // this.add.image(2048, 0, 'background-' + i).setScale(0.5).setOrigin(0).setScrollFactor(2 / i, 1);
        }

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
        this.player = new Player({ scene: this, x: 100, y: 400 });
        // PNG
        this.png = new PNJ({ scene: this, x: 3154, y: 410 });
        this.png.flipX = true;

        //  when first time scene called
        if (data.skipRegistry === undefined) {
            this.player.x =3000;
            this.player.y = 300;
            this.registry.set('nbrLife', 3);
            this.player.disableControls = true;
            this.player.walk('right');
            this.player.on('animationcomplete',()=>{
                this.player.disableControls = false;
                this.player.state = "idle";
                this.time.addEvent({delay:400,callback:()=>{this.startDialogScene()}});
                this.player.off('animationcomplete');
            })
        }

        config.scene.physics.add.collider(this.groundLayer, this.player);
        config.scene.physics.add.collider(this.groundLayer, this.png);

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

        let pauseButton = this.add.image(this.game.canvas.width - 30, 25, 'pause').setScrollFactor(0).setScale(0.15);
        pauseButton.setInteractive().on('pointerup', () => {
            this.cameras.main.fadeEffect.alpha = 0.3;
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

    }

    update(): void {
        console.log(this.player.x, this.player.y)
        this.player.update();

        if (this.player.state !== "dying") {
            this.png.update();
            this.lifes.forEach(life => { life.update(this.player); });
            this.beasts.forEach(beasts => {
                for (let beast of beasts)
                    beast.update()
            });
            this.playerCollide();
            if (this.player.y > 700)
                this.playerDie();
            if (this.player.x > 3060 && (this.player.body as Phaser.Physics.Arcade.Body).onFloor() && this.dialogNumber < 4)
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
            if (nbrLife < 0)
                this.scene.start('menu');
            else {
                this.scene.restart({ skipRegistry: true });
            }
        })
    }

    registryEvents(parent: Phaser.Game, key: string, data: boolean | number) {
        if (key === 'nbrLife') {
            this.lifeText.setText("x" + data.toString());
            TweenHelper.flashElement(this, this.lifeText);
            TweenHelper.flashElement(this, this.lifeImg);
        }
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

    startDialogScene(): void {
        this.dialogNumber++;
        let textsAndImg: Array<textAndImg> = [];
        switch (this.dialogNumber) {
            case 1:
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause();
                textsAndImg = [
                    { text: "Je hais cette forêt !!!", img: 'player_sad' },
                    { text: "Et particulièrement tous ces horribles animaux ! Il faut que je me dépêche de rejoindre Caporal Coon... ", img: 'player_sad' }
                ]
                this.scene.launch("DialogScene", { textsAndImg: textsAndImg });
                break;

            case 2:
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause();
                textsAndImg = [
                    { text: "Meine Coon !!! Je suis si heureux de vous avoir enfin trouvé ! ", img: 'player_happy' },
                    { text: "Le plaisir est partagé soldat Griffouille, mais hélas vous arrivez trop tot... ", img: 'pnj_serious', flipImg: true },
                    { text: "Les instructions de mission n'arriverons pas avant Mars 2023, nous devons hélas patienter ici ", img: 'pnj_serious', flipImg: true },
                    { text: "Non cette foret grouille d'animaux et je hais TOUS les animaux !!!", img: 'player_sad' }
                ]
                this.scene.launch("DialogScene", { textsAndImg: textsAndImg });
                break;

            case 3:
                this.cameras.main.fadeOut(2000);
                this.player.disableControls = false;
                this.registry.set('')
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('menu');
                })
                break;


            default:
                break;
        }
    }

}
