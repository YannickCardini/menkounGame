import { Physics, Scene, Tilemaps } from "phaser";

export interface MushroomConfig {
    scene: Scene,
    x: number,
    y: number,
    state?: string,
    walkingRangeX1: number,
    walkingRangeX2: number
}

export class Mushroom extends Physics.Arcade.Sprite{

    scene: Scene;
    config: MushroomConfig;

    constructor(config: MushroomConfig){

        
        super(config.scene, config.x, config.y, 'mushroom'); 

        this.config = config;

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setScale(0.125);
        this.state = config.state ? config.state :"walking_right";

        this.createAnims(config.scene);

        config.scene.time.addEvent({ delay: 500, callback: this.delayDone, callbackScope: this, loop: false });

        this.mushroomMovements(config.walkingRangeX1,config.walkingRangeX2);

    }

    addCollider(groundLayer){
        this.scene.physics.add.collider(groundLayer,this);
    }

    createAnims(scene: Scene){
        scene.anims.create({
            key: "mushroom_walk",
            frames: scene.anims.generateFrameNames('mushroom', { prefix: 'm1_walk', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 5,
            repeat: -1
        });

        scene.anims.create({
            key: "mushroom_crush",
            frames: scene.anims.generateFrameNames('mushroom', { prefix: 'm1_crush', start: 1, end: 4, zeroPad: 2 }),
            frameRate: 15,
            repeat: -1
        });
    }

    delayDone(): void {
        this.body.setSize(this.width - 80, this.height - 210, true);
        this.body.setOffset(50, 155);
    }

    jumpOnMushroom(): void {
        this.state = "crushed";
        this.config.scene.time.addEvent({ delay: 300, callback: this.stopCrush, callbackScope: this, loop: false })
    }

    public mushroomMovements(): void {

        let x1= this.config.walkingRangeX1;
        let x2= this.config.walkingRangeX2;
        let walkSpeed = 50;
        
        if (this.x > x2 && this.state === "walking_right")
            this.state = "walking_left";
        else if (this.x < x1 && this.state === "walking_left")
            this.state = "walking_right";

        if (this.state === "walking_right") {
            this.setVelocityX(walkSpeed)
            this.flipX = false;
        }
        else if (this.state === "walking_left") {
            this.setVelocityX(-walkSpeed)
            this.flipX = true;
        }

    }


    stopCrush(): void {
        this.state = this.flipX ? "walking_left" : "walking_right";
    }

}