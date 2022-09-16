import { Scene } from "phaser";
import { Bestiaire, BestiaireConfig } from "./Bestiaire";

export class Bird extends Bestiaire {

    scene: Scene;

    constructor(config: BestiaireConfig) {

        config.hitbox = {
            width: 80,
            height: 120,
            offsetX: 40,
            offsetY: 60
        };

        super(config, 'bird');

        this.scene = config.scene;

        this.setScale(0.5);

        (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;

        this.createAnims(config.scene);

    }

    animations() {
        switch (this.state) {
            case 'dying':
                this.anims.play("bird_dying",true);
            default:
                this.anims.play("fly", true);
                break;
        }
    }

    createAnims(scene: Scene) {
        scene.anims.create({
            key: "fly",
            frames: scene.anims.generateFrameNames('bird', { prefix: 'b1_fly', start: 1, end: 9, zeroPad: 2 }),
            frameRate: 7,
            repeat: -1
        });
        scene.anims.create({
            key: "bird_dying",
            frames: scene.anims.generateFrameNames('bird', { prefix: 'b1_fly', start: 1, end: 3, zeroPad: 2 }),
            frameRate: 30,
        });
    }

    update(...args: any[]): void {
        if (this.state !== "dead") {
            this.animations();
            this.beastMovements(140);
            if(this.body.x < -200)
                this.die('slide');
        }
    }

}