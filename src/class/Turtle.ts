import { Scene } from "phaser";
import { Bestiaire, BestiaireConfig } from "./Bestiaire";

export class Turtle extends Bestiaire {

    scene: Scene;

    constructor(config: BestiaireConfig) {

        config.hitbox = {
            width: 40,
            height: 70,
            offsetX: 20,
            offsetY: 70
        };

        super(config, 'turtle');

        this.scene = config.scene;

        this.setScale(0.18 * (config.scale ?? 1));

        this.createAnims(config.scene);

    }

    animations() {
        switch (this.state) {
            default:
                this.anims.play("turtle_walk", true);
                break;
        }
    }

    createAnims(scene: Scene) {
        scene.anims.create({
            key: "turtle_walk",
            frames: scene.anims.generateFrameNames('turtle', { prefix: 't1_walk', start: 1, end: 8, zeroPad: 2 }),
            frameRate: 4,
            repeat: -1
        });
    }

    update(...args: any[]): void {
        if (this.state !== "dying" && this.state !== "dead") {
            this.animations();
            this.beastMovements(9);
        }
    }

}