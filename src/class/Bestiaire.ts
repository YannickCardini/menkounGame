import { Physics, Scene, Tilemaps } from "phaser";

export interface hitbox {
    width: number,
    height: number,
    offsetX: number,
    offsetY: number
}

export interface BestiaireConfig {
    scene: Scene,
    x: number,
    y: number,
    state?: string,
    movingRangeX1: number,
    movingRangeX2: number,
    hitbox?: hitbox,
    ground?: Tilemaps.TilemapLayer
}


export class Bestiaire extends Physics.Arcade.Sprite {

    config: BestiaireConfig;
    collider: Physics.Arcade.Collider;

    constructor(config: BestiaireConfig, atlas: string) {

        super(config.scene, config.x, config.y, atlas);

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.config = config;

        this.state = config.state ? config.state : "moving_right";

        if (config.ground)
            this.collider = config.scene.physics.add.collider(config.ground, this);

        config.scene.anims.create({
            key: "boom",
            frames: config.scene.anims.generateFrameNames('disappear', { prefix: 'c1_boom', start: 1, end: 3, zeroPad: 2 }),
            frameRate: 7,
        });

        config.scene.time.addEvent({ delay: 100, callback: this.delayDone, callbackScope: this, loop: false });

    }

    beastMovements(speed = .8): void {
        let x1 = this.config.movingRangeX1;
        let x2 = this.config.movingRangeX2;
        let moveSpeed = speed;

        if (this.x > x2 && this.state === "moving_right")
            this.state = "moving_left";
        else if (this.x < x1 && this.state === "moving_left")
            this.state = "moving_right";

        if (this.state === "moving_right") {
            this.x += (moveSpeed)
            this.flipX = false;
        }
        else if (this.state === "moving_left") {
            this.x += (-moveSpeed)
            this.flipX = true;
        }
    }

    delayDone(): void {
        if (this.config.hitbox) {
            this.body.setSize(this.width - this.config.hitbox.width, this.height - this.config.hitbox.height, true);
            this.body.setOffset(this.config.hitbox.offsetX, this.config.hitbox.offsetY);
        }
        else
            this.body.setSize(this.width, this.height)

    }

    die(anim: string): void {
        this.state = "dying";

        if (anim === 'slide') {
            (this.body as Phaser.Physics.Arcade.Body).allowGravity = true;
            this.setVelocityY(-250);
            if (this.collider)
                this.collider.active = false;
            this.config.scene.time.addEvent({ delay: 1500, callback: () => { this.state = "dead"; this.destroy; }, callbackScope: this, loop: false });

        }
        else if (anim === 'jump') {
            this.state = "dead";
            this.setVisible(false);
            let sprite = this.config.scene.add.sprite(this.x, this.y, "disappear");
            this.scene.cameras.getCamera('UICam').ignore(sprite);
            sprite.anims.play("boom", true);
            sprite.on("animationcomplete", () => {
                sprite.destroy();
                this.destroy();
            })
        }
    }

    playerDie(): void {
        if (this.active) {
            this.anims.stop();
        }
    }

}
