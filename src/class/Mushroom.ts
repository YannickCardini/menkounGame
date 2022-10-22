import { Physics, Scene, Tilemaps } from "phaser";
import { Bestiaire, BestiaireConfig } from "./Bestiaire";

export class Mushroom extends Bestiaire {

    scene: Scene;

    constructor(config: BestiaireConfig) {

        config.hitbox = {
            width: 80,
            height: 210,
            offsetX: 50,
            offsetY: 155
        };

        super(config, 'mushroom');

        this.scene = config.scene;

        this.setScale(0.125 * (config.scale ?? 1));

        this.createAnims(config.scene);

    }

    animations() {
        switch (this.state) {
            case "crushed":
                this.anims.play("mushroom_crush", true);
                break;

            default:
                this.anims.play("mushroom_walk", true);
                break;
        }
    }

    createAnims(scene: Scene) {
        scene.anims.create({
            key: "mushroom_walk",
            frames: scene.anims.generateFrameNames('mushroom', { prefix: 'm1_walk', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 5,
            repeat: -1
        });

        scene.anims.create({
            key: "mushroom_crush",
            frames: scene.anims.generateFrameNames('mushroom', { prefix: 'm1_crush', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 8,
            repeat: -1
        });
    }

    jumpOnMushroom(): void {
        this.state = "crushed";
        this.config.scene.time.addEvent({ delay: 300, callback: this.stopCrush, callbackScope: this, loop: false })
    }

    stopCrush(): void {
        this.state = this.flipX ? "moving_left" : "moving_right";
    }

    update(...args: any[]): void {
        if (this.state !== "dying" && this.state !== "dead") {
            this.animations();
            this.beastMovements();
        }
    }

}