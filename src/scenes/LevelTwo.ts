import Phaser, { Tilemaps } from "phaser";
import { Bestiaire } from "~/class/Bestiaire";
import { Bird } from "~/class/Bird";
import { Boar } from "~/class/Boar";
import { Dialog, textAndImg } from "~/class/Dialog";
import { Life } from "~/class/Life";
import { Mushroom } from "~/class/Mushroom";
import { Player } from "~/class/Player";
import { PNJ } from "~/class/PNJ";
import { Turtle } from "~/class/Turtle";
import { UI } from "~/class/UI";
import { Debug } from "~/debug.mode";
import SceneEnums from "~/enums/SceneEnums";

export default class levelTwo extends Phaser.Scene {
    map: Tilemaps.Tilemap;
    groundLayer: Tilemaps.TilemapLayer;
    player: Player;
    beasts: Array<Array<Bestiaire>>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    static readonly tileSize: number = 128;
    debugPlayerPositionText: Phaser.GameObjects.Text;
    lifes: Array<Life>;
    ui: UI;
    pauseButton: Phaser.GameObjects.Image;
    dialog: Dialog;
    png: PNJ;
    dialogNumber: number;
    ratio: number;
    debugText: Phaser.GameObjects.Text;
    static readonly scale = 2;
    splashEffectFinished: boolean;

    constructor() {
        super({
            key: SceneEnums.levelTwo,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 1100 },
                    debug: Debug.MODE,
                },
            },
        });
    }

    init(data: { firstTime: boolean }) {
        if (Debug.START_LEVEL_2) {
            let { width, height } = this.sys.game.canvas;
            this.registry.set('canvas', { width: width, height: height, ratio: width / 620 });
            this.ratio = width / 620;
            // this.registry.set('nbrLife', 3);
            if(data.firstTime)this.displayLoadingBar(width, height);
        }
        this.scene.run(SceneEnums.particle);
    }

    preload() {
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON("map", "/assets/tiled/level2/level2.json");
        //Load bg image
        this.load.image('background', 'assets/background/level2/bg.png')
        // tiles in spritesheet
        this.load.image("tiles", "assets/tiled/level2/tiles_extruded.png");
        // object of maps
        this.load.image("decor", "assets/tiled/level2/decor.png");
        // life info
        this.load.image("life", "assets/life.png");
        // player animations
        this.load.atlas("cat", "assets/player.png", "assets/player.json");
        this.load.atlas("pnj", "assets/pnj.png", "assets/pnj.json");
        // effects
        this.load.atlas(
            "disappear",
            "assets/effects/disappear.png",
            "assets/effects/disappear.json"
        );
        // disappear animations
        this.load.atlas(
            "dash",
            "assets/effects/dash.png",
            "assets/effects/dash.json"
        );
        // splash animations
        this.load.atlas(
            "splash",
            "assets/effects/splash.png",
            "assets/effects/splash.json"
        );
        // mushroom animations
        this.load.atlas(
            "mushroom",
            "assets/bestiaire/mushroom.png",
            "assets/bestiaire/mushroom.json"
        );
        // turtle animations
        this.load.atlas(
            "turtle",
            "assets/bestiaire/turtle.png",
            "assets/bestiaire/turtle.json"
        );
        // boar animations
        this.load.atlas(
            "boar",
            "assets/bestiaire/boar.png",
            "assets/bestiaire/boar.json"
        );
        // bird animations
        this.load.atlas(
            "bird",
            "assets/bestiaire/bird.png",
            "assets/bestiaire/bird.json"
        );
        // pause game
        this.load.image("pause", "assets/ui/pause_button.png");

        if (!this.sys.game.device.os.desktop) {
            // load button mobile
            this.load.image("slide_button", "assets/ui/slide_button.png");
            this.load.image("jump_button", "assets/ui/jump_button.png");
            this.load.image("left_button", "assets/ui/left_button.png");
            this.load.image("right_button", "assets/ui/right_button.png");
        }
    }

    create(data: {firstTime: boolean}) {
        let { width, height } = this.sys.game.canvas;
        this.splashEffectFinished = true;

        this.events.on("resume", (scene, data) => {
            // @ts-ignore
            this.cameras.main.fadeEffect.alpha = 0;
        });

        //Add background
        this.add.image(0, 0, 'background').setOrigin(0);

        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
            key: "map",
            tileWidth: levelTwo.tileSize,
            tileHeight: levelTwo.tileSize,
        };
        // load the map
        this.map = this.make.tilemap(tilemapConfig);

        // tile image
        const tiles = this.map.addTilesetImage("tiles", undefined, 128, 128, 1, 2)!;
        // create the ground layer
        this.groundLayer = this.map.createLayer("Tile Layer 1", tiles)!;

        // create decor layer
        this.add.image(0,0,"decor").setOrigin(0);

        // create the player sprite
        this.player = new Player({
            scene: this,
            x: levelTwo.tileSize * 4,
            y: this.map.heightInPixels - levelTwo.tileSize * 6,
            scale: levelTwo.scale
        });

        // create the water
        this.map.createLayer('Water Layer', tiles);
        this.anims.create({
            key: "splash",
            frames: this.anims.generateFrameNames('splash', { prefix: 'splash', start: 1, end: 7, zeroPad: 2 }),
            frameRate: 16,
        })

        // // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
        // // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        // create the mushroom sprite
        let mushrooms = [
            new Mushroom({
                scene: this,
                x: 11.5 * levelTwo.tileSize,
                y: levelTwo.tileSize * 23,
                movingRangeX1: 11.5 * levelTwo.tileSize,
                movingRangeX2: 13 * levelTwo.tileSize,
                ground: this.groundLayer,
                scale: levelTwo.scale
            }),
            new Mushroom({
                scene: this,
                x: 78.5 * levelTwo.tileSize,
                y: levelTwo.tileSize * 18,
                movingRangeX1: 78.5 * levelTwo.tileSize,
                movingRangeX2: 79.5 * levelTwo.tileSize,
                ground: this.groundLayer,
                scale: levelTwo.scale
            }),
        ];
        let birds = [
            new Bird({
                scene: this,
                x: levelTwo.tileSize * 60,
                y: levelTwo.tileSize * 10,
                movingRangeX1: -levelTwo.tileSize * 80,
                movingRangeX2: levelTwo.tileSize * 60,
                scale: levelTwo.scale
            }),
            new Bird({
                scene: this,
                x: levelTwo.tileSize * 70,
                y: levelTwo.tileSize * 2,
                movingRangeX1: -levelTwo.tileSize * 80,
                movingRangeX2: levelTwo.tileSize * 70,
                scale: levelTwo.scale
            }),
            new Bird({
                scene: this,
                x: levelTwo.tileSize * 80,
                y: levelTwo.tileSize * 15,
                movingRangeX1: -levelTwo.tileSize * 80,
                movingRangeX2: levelTwo.tileSize * 80,
                scale: levelTwo.scale
            }),
        ];
        let turtle = [
            new Turtle({
                scene: this,
                x: levelTwo.tileSize * 26,
                y: 2 * levelTwo.tileSize,
                state: "moving_right",
                movingRangeX1: levelTwo.tileSize * 26,
                movingRangeX2: levelTwo.tileSize * 32.5,
                ground: this.groundLayer,
                scale: levelTwo.scale
            }),
        ];

        let boars = [
            new Boar({
                scene: this,
                x: levelTwo.tileSize * 25,
                y: levelTwo.tileSize * 16,
                movingRangeX1: levelTwo.tileSize * 25,
                movingRangeX2: levelTwo.tileSize * 43,
                ground: this.groundLayer,
                scale: levelTwo.scale
            }),
        ];
        this.beasts = [boars, mushrooms, birds, turtle];

        // PNG
        this.png = new PNJ({
            scene: this,
            x: levelTwo.tileSize * 98,
            y: levelTwo.tileSize * 13,
        });
        this.png.flipX = true;

        this.lifes = [
            new Life(this, levelTwo.tileSize * 88.5, levelTwo.tileSize * 18.5),
            new Life(this, levelTwo.tileSize * 53.98, levelTwo.tileSize * 2.3),
        ];

        this.ui = this.add.existing(new UI(this));
        if (!data.firstTime) this.ui.lifeBlink();

        this.physics.add.collider(this.groundLayer, this.player);
        this.physics.add.collider(this.groundLayer, this.png);

        //  Add in a new camera, the same size and position as the main camera
        const UICam = this.cameras.add(0, 0, width, height, false, "UICam");

        //  The main camera will not render the UI Text objects
        this.cameras.main.ignore(this.ui);

        this.cameras.main.setBounds(
            levelTwo.tileSize,
            0,
            this.map.widthInPixels - levelTwo.tileSize,
            this.map.heightInPixels
        );

        UICam.ignore(
            this.children.list.filter(
                (child: Phaser.GameObjects.GameObject) => !(child instanceof UI)
            )
        );

        // make the camera follow the player
        this.cameras.main.startFollow(this.player);
        // this.cameras.main.zoomTo(this.ratio, 1000, "Linear", false);
        this.cameras.main.fadeIn(2000);

        if (Debug.MODE) {
            var rect = this.add.rectangle(
                10,
                height - 100,
                width * 0.6,
                100,
                0x000000,
                0.5
            );
            this.debugText = this.add.text(rect.x, rect.y - 20, "Move the mouse", {
                font: "16px Courier",
                color: "#00ff00",
            });
            this.cameras.main.ignore([this.debugText, rect]);
        }

    }

    update(): void {
        if (Debug.MODE) {
            this.debugText.setText([
                "PLayer(X,Y): " +
                this.player.x.toFixed(1) +
                "," +
                this.player.y.toFixed(1),
                "Input(X,Y): " +
                this.input.x.toFixed(1) +
                "," +
                this.input.y.toFixed(1),
                "Camera worldView(X,Y): " +
                this.cameras.main.worldView.x.toFixed(1) +
                "," +
                this.cameras.main.worldView.y.toFixed(1),
            ]);
        }

        if (Debug.CLICK) {
            this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                this.player.setPosition(pointer.worldX, pointer.worldY);
            });
        }

        this.player.update();

        if (this.player.state !== "dying") {
            this.png.update();
            this.lifes.forEach((life) => {
                life.update(this.player);
            });
            this.beasts.forEach((beasts) => {
                for (let beast of beasts) {
                    beast.update();
                }
            });
            this.playerCollide();
            //check contact with water
            if (this.player.y > levelTwo.tileSize * 26 && this.player.x > levelTwo.tileSize * 10 && this.player.x < levelTwo.tileSize * 16)
                this.splashEffect(this.player.x,levelTwo.tileSize * 25.5)
            if (this.player.y > levelTwo.tileSize * 30 + this.player.height)
                this.playerDie();
        }
    }

    displayLoadingBar(width: number, height): void {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        var progressBarWidth = 320 * this.ratio;
        var progressBarHeight = 50 * this.ratio;
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(
            width * 0.5 - progressBarWidth / 2,
            height * 0.5 - progressBarHeight / 2,
            progressBarWidth,
            progressBarHeight
        );

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50 * this.ratio,
            text: "Chargement...",
            style: {
                // font: '20px monospace',
                color: "#ffffff",
                fontSize: (12 * this.ratio).toString() + "px",
            },
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5 * this.ratio,
            text: "0%",
            style: {
                fontSize: (10 * this.ratio).toString() + "px",
                color: "#ffffff",
            },
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50 * this.ratio,
            text: "",
            style: {
                fontSize: (10 * this.ratio).toString() + "px",
                color: "#ffffff",
            },
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on("progress", (value) => {
            percentText.setText((value * 100).toString() + "%");
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                width * 0.5 - progressBarWidth / 2 + 10 * this.ratio,
                height * 0.5 - progressBarHeight / 2 + 10 * this.ratio,
                (progressBarWidth - 20 * this.ratio) * value,
                progressBarHeight - 20 * this.ratio
            );
        });
        this.load.on("fileprogress", function (file) {
            assetText.setText("Chargement du fichier: " + file.src);
        });
        this.load.on("complete", function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    playerCollide(): void {
        for (let j = 0; j < this.beasts.length; j++) {
            const beasts = this.beasts[j];
            for (let i = 0; i < beasts.length; i++) {
                const beast = beasts[i];
                // handling collision between enemy and hero
                if (beast.state !== "dying" && beast.state !== "dead")
                    this.physics.world.collide(this.player, beast, (hero) => {
                        if (beast.body?.touching.up && (hero as Phaser.Types.Physics.Arcade.GameObjectWithBody).body.touching.down) {
                            if (beast instanceof Mushroom) {
                                this.player.setVelocityY(-this.player.velocity * 3);
                                beast.jumpOnMushroom();
                            } else if (beast instanceof Turtle) {
                                this.playerDie();
                            } else {
                                this.player.setVelocityY(-this.player.velocity);
                                beast.die("jump");
                            }
                        } else if (
                            beast instanceof Boar &&
                            ((beast.body?.touching.right && !beast.flipX) ||
                                (beast.body?.touching.left && beast.flipX))
                        ) {
                            this.playerDie();
                        } else {
                            if (this.player.state === "sliding") beast.die("slide");
                            else this.playerDie();
                        }
                    });
            }
        }
    }

    playerDie(): void {
        this.cameras.main.fadeOut(1800);
        this.cameras.main.ignore(this.player);

        this.scene.launch(SceneEnums.death, {
            x: this.player.x - this.cameras.main.worldView.x,
            y: this.player.y - this.cameras.main.worldView.y,
            flip: this.player.flipX,
        });

        this.registry.events.off("changedata");
        this.player.die();
        this.beasts.forEach((beasts) => {
            beasts.forEach((beast) => beast.playerDie());
        });
        let nbrLife = this.registry.get("nbrLife") - 1;
        this.registry.set("nbrLife", nbrLife);

        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) => {
                console.log("ici")
                this.events.removeListener("jumpPressed");
                this.events.removeListener("slidePressed");
                this.events.removeListener("leftPressed");
                this.events.removeListener("rightPressed");
                this.events.removeListener("resume");
                this.load.removeAllListeners();

                if (nbrLife < 0) this.scene.start(SceneEnums.menu);
                else {
                    this.scene.restart({ firstTime: false });
                }
            }
        );
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

    splashEffect(x: number, y: number): void{
        if(this.splashEffectFinished){
            this.splashEffectFinished = false;
            let sprite = this.add.sprite(x, y , "splash");
            this.cameras.getCamera('UICam')?.ignore(sprite);
            sprite.anims.play("splash", true);
            sprite.on("animationcomplete", () => {
                sprite.destroy();
            });
        }

    }

    startDialogScene(): void {
        this.dialogNumber++;
        let textsAndImg: Array<textAndImg> = [];
        switch (this.dialogNumber) {
            case 1:
                if (Debug.SKIP_DIALOG) break;
                // @ts-ignore
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause(   );
                textsAndImg = [
                    { text: "Je hais cette forêt !!!", img: "player_sad" },
                    {
                        text: "Et particulièrement tous ces horribles animaux ! Il faut que je me dépêche de rejoindre Caporal Coon... ",
                        img: "player_sad",
                    },
                ];
                this.scene.launch(SceneEnums.dialog, { textsAndImg: textsAndImg });
                break;

            case 2:
                if (Debug.SKIP_DIALOG) break;
                // @ts-ignore
                this.cameras.main.fadeEffect.alpha = 0.8;
                this.scene.pause();
                textsAndImg = [
                    {
                        text: "Meine Coon !!! Je suis si heureux d'enfin vous retrouver ! Je vais pouvoir enfin quitter cette maudite nature !",
                        img: "player_happy",
                    },
                    {
                        text: "Le plaisir est partagé soldat Griffouille, mais hélas vous arrivez trop tôt.",
                        img: "pnj_serious",
                        flipImg: true,
                    },
                    {
                        text: "Aucune mission d'extraction de cette forêt n'est prévue avant mars 2023, on va devoir hélas patienter ici...",
                        img: "pnj_serious",
                        flipImg: true,
                    },
                    {
                        text: "Non Meine Coon ! Je HAIS cette forêt et tous les animaux qui la peuplent !",
                        img: "player_sad",
                    },
                    {
                        text: "Courage soldat Grifouille, armez-vous de patience.",
                        img: "pnj_serious",
                        flipImg: true,
                    },
                ];
                this.scene.launch(SceneEnums.dialog, { textsAndImg: textsAndImg });
                break;

            case 3:
                this.cameras.main.fadeOut(2000);
                this.registry.events.off("changedata");
                this.player.disableControls = true;
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.start(SceneEnums.menu);
                    }
                );
                break;

            default:
                break;
        }
    }
}
