import { Physics, Scene } from 'phaser';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js'


export class Life extends Phaser.GameObjects.Image {

    y1: number;
    y2: number;
    scene: Scene;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'life');
        scene.add.existing(this);
        this.setScale(0.4)
        this.scene = scene;
        var postFxPlugin = scene.plugins.get('rexGlowFilterPipeline');
        (postFxPlugin as GlowFilterPipelinePlugin)
            .add(this, {
                distance: 15,
                glowColor: 0xF8D56B,
            });
        this.y1 = y - 4;
        this.y2 = y + 4;
    }

    disappearEffect(): void {

        this.setVisible(false);

        let sprite = this.scene.add.sprite(this.x, this.y, "disappear")

        this.scene.anims.create({
            key: "boom",
            frames: this.scene.anims.generateFrameNames('disappear', { prefix: 'c1_boom', start: 1, end: 3, zeroPad: 2 }),
            frameRate: 7,
        });

        sprite.anims.play("boom", true);
        sprite.on("animationcomplete", () => {
            sprite.destroy();
            this.destroy();
        })

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
                console.log(this.scene)
                this.disappearEffect();

            }
        }

    }

}


