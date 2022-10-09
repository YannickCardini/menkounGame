import { Physics, Scene } from "phaser";

export interface playerConfig {
    scene: Scene,
    x: number,
    y: number,
}

export class PNJ extends Physics.Arcade.Sprite {

    config: playerConfig;
    static readonly VELOCITY: number = 200;

    constructor(config: playerConfig) {
        super(config.scene, config.x, config.y, 'pnj');

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        config.scene.time.addEvent({ delay: 500, callback: this.delayDone, callbackScope: this, loop: false });

        this.setScale(0.6);
        this.createAnims(config.scene);

        this.config = config;
    }

    animation(): void {
        switch (this.state) {
            case "sliding":
                this.anims.play("pnj_slide", true);
                break;
            case "falling":
                this.anims.play("pnj_fall", true);
                break;
            case "jumping":
                this.anims.play('pnj_jump', true);
                break;
            case "running":
                this.anims.play("pnj_run", true);
                break;
            case "dying":
                this.anims.play("pnj_dead", true);
                break;
            case "idling":
                this.anims.play("pnj_idle", true);
                break;
            default:
                this.anims.play("pnj_idle", true);;
        };
    }

    createAnims(scene: Scene) {

        scene.anims.create({
            key: "pnj_walk",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_walk', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "pnj_dead",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_dead', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 6,
        })

        scene.anims.create({
            key: "pnj_idle",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_idle', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: "pnj_run",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_run', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: "pnj_jump",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_jump', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })

        scene.anims.create({
            key: "pnj_fall",
            frames: scene.anims.generateFrameNames('pnj', { prefix: 'c1_fall', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 9,
        })
    }

    delayDone(): void {
        this.body.setSize(this.width - 80, this.height - 10, true);
    }

    getCurrentState(): string {
        if (this.state === "dying")
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

    run(left = true): void {
        let isNegatif = left ? -1 : 1;
        this.setVelocityX(isNegatif * PNJ.VELOCITY); // move left
        this.flipX = left; // flip the sprite to the left
    }

    update(...args: any[]): void {
        this.animation();
        this.state = this.getCurrentState();
    }
}


