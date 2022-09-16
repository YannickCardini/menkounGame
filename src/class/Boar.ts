import { Physics, Scene, Tilemaps } from "phaser";
import { Bestiaire, BestiaireConfig } from "./Bestiaire";

export class Boar extends Bestiaire {

    scene: Scene;
    static VELOCITY = 170;
    freeze = false;

    constructor(config: BestiaireConfig) {

        config.hitbox = {
            width: 60,
            height: 70,
            offsetX: 30,
            offsetY: 62
        };

        config.state = "charging_right"

        super(config, 'boar');

        this.scene = config.scene;

        let scale = Phaser.Math.Between(3, 5);

        this.setScale(scale*0.1);

        this.createAnims(config.scene);

    }

    animations() {
        switch (this.state) {
            case "charging_right":
                this.anims.play("boar_charge", true);
                break;

            case "charging_left":
                this.anims.play("boar_charge", true);
                break;

            case "dying":
                if (!this.freeze)
                    this.anims.play("boar_dying", true);
                break;

            default:
                this.anims.play("boar_idle", true);
                break;
        }
    }

    boartMovements(): void {
        let x1 = this.config.movingRangeX1;
        let x2 = this.config.movingRangeX2;

        if (this.x > x2 && this.state === "charging_right")
            this.repos();
        else if (this.x < x1 && this.state === "charging_left")
            this.repos();

        if (this.state === "charging_right") {
            this.setVelocityX(Boar.VELOCITY)
            this.flipX = false;
        }
        else if (this.state === "charging_left") {
            this.setVelocityX(-Boar.VELOCITY)
            this.flipX = true;
        }
    }

    chargeAgain(): void {
        if (this.state !== "dead" && this.state !== "dying")
            this.state = !this.flipX ? "charging_left" : "charging_right";
    }

    createAnims(scene: Scene) {
        scene.anims.create({
            key: "boar_charge",
            frames: scene.anims.generateFrameNames('boar', { prefix: 'b1_charge', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 15,
            repeat: -1
        });

        scene.anims.create({
            key: "boar_idle",
            frames: scene.anims.generateFrameNames('boar', { prefix: 'b1_idle', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 4,
            repeat: -1
        });

        scene.anims.create({
            key: "boar_dying",
            frames: scene.anims.generateFrameNames('boar', { prefix: 'b1_die', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 16,
        });
    }

    die(anim: string): void {
        this.state = "dying";
        this.setVelocityX(0);

        if (anim === 'slide') {
            this.on('animationcomplete', () => this.freeze = true);
            (this.body as Phaser.Physics.Arcade.Body).allowGravity = true;
            this.setVelocityY(-250);
            if (this.collider)
                this.collider.active = false;
            this.config.scene.time.addEvent({ delay: 1500, callback: () => { this.state = "dead"; this.destroy; }, callbackScope: this, loop: false });

        }
        else if (anim === 'jump') {
            this.on("animationcomplete", () => {
                this.state = "dead";
                this.setVisible(false);
                let sprite = this.config.scene.add.sprite(this.x, this.y, "disappear");
                sprite.anims.play("boom", true);
                sprite.on("animationcomplete", () => {
                    sprite.destroy();
                    this.destroy();
                })
            })
        }
    }

    repos(): void {
        this.setVelocityX(0);
        this.state = "idle";
        let delay = Phaser.Math.Between(3000, 6000);
        this.config.scene.time.addEvent({ delay: delay, callback: this.chargeAgain, callbackScope: this, loop: false })
    }

    update(...args: any[]): void {
        if (this.state !== "dead") {
            this.animations();
            this.boartMovements();
        }
    }

}