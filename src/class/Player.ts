import { Physics, Scene } from "phaser";

export interface playerConfig {
    scene: Scene,
    x: number,
    y: number,
}

export class Player extends Physics.Arcade.Sprite {

    collider: Physics.Arcade.Collider;
    config: playerConfig;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    downKey: Phaser.Input.Keyboard.Key;
    stopAnimation: boolean;
    static readonly VELOCITY: number = 200;

    constructor(config: playerConfig) {
        super(config.scene, config.x, config.y, 'cat');

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
        this.cursors = config.scene.input.keyboard.createCursorKeys();
        config.scene.time.addEvent({ delay: 500, callback: this.delayDone, callbackScope: this, loop: false });

        this.setScale(0.5);
        this.createAnims(config.scene);

        this.config = config;
        this.stopAnimation = false;
        this.downKey = config.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    animation(): void {
        switch (this.state) {
            case "sliding":
                this.anims.play("slide", true);
                break;
            case "falling":
                this.anims.play("fall", true);
                break;
            case "jumping":
                this.anims.play('jump', true);
                break;
            case "running":
                this.anims.play("run", true);
                break;
            case "sliding":
                this.anims.play("slide", true);
                break;
            case "dying":
                this.anims.play("dead", true);
                break;
            case "idling":
                this.anims.play("idle", true);
                break;
            default:
                this.anims.play("idle", true);;
        };
    }

    controlsDesktop(): void {
        if (this.state === "sliding") {
            if (this.flipX)
                this.setVelocityX(-Player.VELOCITY)
            else
                this.setVelocityX(Player.VELOCITY)
        }
        else if ((this.cursors.space.isDown || this.cursors.up.isDown))
            this.jump();
        else if (Phaser.Input.Keyboard.JustDown(this.downKey))
            this.slide();
        else if (this.cursors.left.isDown) // if the left arrow key is down
            this.run();
        else if (this.cursors.right.isDown) // if the right arrow key is down
            this.run(false);
        else
            this.setVelocityX(0);
    }

    controlsMobile(): void {

        let worldX = this.config.scene.cameras.main.worldView.x;
        let worldY = this.config.scene.cameras.main.worldView.y;

        let jumpButton = this.config.scene.add.image(worldX + 513, worldY + 238, 'jump_button').setScrollFactor(0).setInteractive();
        let slideButton = this.config.scene.add.image(jumpButton.x + 50, jumpButton.y + 45, 'slide_button').setScrollFactor(0).setInteractive();
        let leftButton = this.config.scene.add.image(worldX + 50, slideButton.y, 'left_button').setScrollFactor(0).setInteractive();
        let rightButton = this.config.scene.add.image(leftButton.x + 70, leftButton.y, 'right_button').setScrollFactor(0).setInteractive();
        let fullScreenButton = this.config.scene.add.image(worldX + 580, worldY + 30, 'fullScreen_button').setScrollFactor(0).setInteractive();

        jumpButton.on('pointerdown', () => {
            this.jump();
        });
        leftButton.on('pointerdown', () => {
            this.run();
        });
        rightButton.on('pointerdown', () => {
            this.run(false);
        });
        slideButton.on('pointerdown', () => {
            this.slide();
            this.pointerUp();
        });
        
        fullScreenButton.on('pointerup',  () => {
            if (this.config.scene.scale.isFullscreen)
            {
                fullScreenButton.setFrame(0);
                this.config.scene.scale.stopFullscreen();
            }
            else
            {
                fullScreenButton.setFrame(1);
                this.config.scene.scale.startFullscreen();
            }
        }, this);


        // jumpButton.on('pointerup', () => {
        //     this.pointerUp();
        // });

        // leftButton.on('pointerup', () => {
        //     this.pointerUp();

        // });
        // rightButton.on('pointerup', () => {
        //     this.pointerUp();
        // });

    }

    createAnims(scene: Scene) {

        scene.anims.create({
            key: "walk",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_walk', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "idle",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_idle', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: "run",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_run', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "slide",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_slide', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
        });

        scene.anims.create({
            key: "jump",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_jump', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })

        scene.anims.create({
            key: "dead",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_dead', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 6,
        })

        scene.anims.create({
            key: "fall",
            frames: scene.anims.generateFrameNames('cat', { prefix: 'p1_fall', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })

    }

    delayDone(): void {
        this.body.setSize(this.width - 80, this.height - 3, true);
    }

    die(): void {
        this.state = "dying";
        this.setVelocity(0, 0);
        (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        this.on("animationcomplete", () => this.stopAnimation = true)

    }

    getCurrentState(): string {
        if (this.state === "sliding" || this.state === "dying")
            return this.state;
        if ((this.body as Phaser.Physics.Arcade.Body).onFloor()) {
            if (this.body.velocity.x !== 0)
                return "running";
            else
                return "idling";
        }
        else {
            if (this.body.velocity.y < 0)
                return "jumping"
            else
                return "falling"
        }
    }

    jump(): void {
        if ((this.body as Phaser.Physics.Arcade.Body).onFloor())
            this.setVelocityY(-500);
    }

    pointerUp(): void {
        if (this.state === "sliding") {
            if (this.flipX)
                this.setVelocityX(-Player.VELOCITY)
            else
                this.setVelocityX(Player.VELOCITY)
        } else {
            this.setVelocityX(0);
        }
    }

    run(left = true): void {
        let isNegatif = left ? -1 : 1;
        this.setVelocityX(isNegatif * Player.VELOCITY); // move left
        this.flipX = left; // flip the sprite to the left
    }

    slide(): void {
        if ((this.body as Phaser.Physics.Arcade.Body).onFloor()) {
            this.state = "sliding";
            this.config.scene.time.addEvent({ delay: 400, callback: this.stopSliding, callbackScope: this, loop: false })
        }
    }

    private stopSliding(): void {
        if (this.state !== "dying") {
            this.state = "idling";
            this.setVelocityX(0);
        }
    }

    update(...args: any[]): void {
        // let R = this.scene.add.rectangle(this.body.x+this.body.width/2, this.body.y+this.body.height/2, this.body.width, this.body.height).setStrokeStyle(2, 0x1a65ac);
        if (!this.stopAnimation)
            this.animation();
        if (this.state !== "dying") {
            this.state = this.getCurrentState();
            if (this.config.scene.sys.game.device.os.desktop) {
                this.controlsDesktop();
            }
            else {
                this.controlsMobile();
            }
        }
    }
}

