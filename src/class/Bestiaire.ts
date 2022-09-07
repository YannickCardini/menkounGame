import { Physics, Scene, Tilemaps } from "phaser";

export interface hitbox{
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
    walkingRangeX1: number,
    walkingRangeX2: number,
    hitbox?: hitbox,
    ground: Tilemaps.TilemapLayer
}


export class Bestiaire extends Physics.Arcade.Sprite {

    config: BestiaireConfig;
    collider: any;

    constructor(config: BestiaireConfig, atlas: string) {

        super(config.scene,config.x,config.y, atlas);

        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.config = config;

        this.state = config.state ? config.state :"walking_right";

        this.collider = config.scene.physics.add.collider(config.ground, this);

        config.scene.time.addEvent({ delay: 500, callback: this.delayDone, callbackScope: this, loop: false });

    }

    beastMovements(): void {
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

    delayDone(): void {
        if(this.config.hitbox){
            this.body.setSize(this.width - this.config.hitbox.width, this.height - this.config.hitbox.height, true);
            this.body.setOffset(this.config.hitbox.offsetX,this.config.hitbox.offsetY);
        }
        else
            this.body.setSize(this.width,this.height)

    }

    die(): void{
        this.state = "dying";
        this.setVelocityY(-250);
        this.setVelocityX(0);
        this.collider.active = false;
        this.config.scene.time.addEvent({ delay: 1500, callback: this.destroy, callbackScope: this, loop: false });
    }

    playerDie(): void{
        if(this.active){
            this.setVelocity(0,0);
            this.anims.stop();
        }
    }

}
