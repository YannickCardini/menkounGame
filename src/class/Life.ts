import { Physics, Scene } from 'phaser';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js'
import { TweenHelper } from './TweenHelper';


export class Life extends Phaser.GameObjects.Image {

    y1: number;
    y2: number;
    scene: Scene;
    nbrLife: number;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'life');
        scene.add.existing(this);
        let { ratio } = this.scene.registry.get('canvas');
        this.setScale(0.4)
        this.scene = scene;
        // var postFxPlugin = scene.plugins.get('rexGlowFilterPipeline');
        // (postFxPlugin as GlowFilterPipelinePlugin)
        //     .add(this, {
        //         distance: 15,
        //         glowColor: 0xF8D56B,
        //         quality: 0.1,
        //     });

        // TweenHelper.floatEffect(scene, this);
        this.y1 = y - 4;
        this.y2 = y + 4;
    }

    disappearEffect(): void {

        let { width, height, ratio } = this.scene.registry.get('canvas');
        let nbrLife = this.scene.registry.get('nbrLife');
        this.scene.registry.set('nbrLife', nbrLife + 1);
        // this.setScrollFactor(0);
        console.log('life position: ',this.x,this.y)
        // this.setX(this.x + this.scene.cameras.main.worldView.x);
        // this.setY(this.y + this.scene.cameras.main.worldView.y);
        // this.setPosition(width*0.5,height*0.5)
        // this.setPosition(381,187)
        console.log('this.scene.camera.maine.worldView',this.scene.cameras.main.worldView.x,this.scene.cameras.main.worldView.y)
        console.log('equation:',this.x - this.scene.cameras.main.worldView.x/ratio,this.y/ratio - this.scene.cameras.main.worldView.x/ratio)
        console.log('life position after set scroll(0):',this.x,this.y)
        TweenHelper.stopTweens();
        TweenHelper.getLifeEffect(this.scene, this);

        // this.scene.tweens.add({targets: this, scale: 0.7, duration: 200, ease: 'Linear',  onComplete: ()=>{
        //     this.scene.tweens.add({ targets: this, x: 20, y: 20, scale: 0.3, duration: 500, ease: 'Linear', onComplete: () => { this.destroy() } });
        // }})

    }

    update(player: Physics.Arcade.Sprite): void {
        if (this.state !== "destroyed") {
            // this.scene.add.rectangle(this.x, this.y, this.width * 0.4, this.height * 0.4).setStrokeStyle(2, 0x1a65ac);

            if (this.y < this.y1)
                this.state = "descend"
            else if (this.y > this.y2)
                this.state = "monte"
            if (this.state === "descend")
                this.setY(this.y += .12)
            else
                this.setY(this.y -= .12)
            let width = this.width * 0.4
            let height = this.height * 0.4
            let px = player.body.x + player.body.width / 2
            let py = player.body.y + player.body.height / 2
            if (((px + player.body.width) >= this.x && px <= (this.x + width))
                && ((py + player.body.height) >= this.y && py <= (this.y + height))) {
                this.state = "destroyed";
                this.disappearEffect();

            }
        }

    }

}


