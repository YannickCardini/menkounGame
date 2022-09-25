import { Physics, Scene } from "phaser";
import GlowFilterPipelinePlugin from "phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js";
import { TweenHelper } from "./TweenHelper";

export class Life extends Phaser.GameObjects.Image {
  scene: Scene;
  nbrLife: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "life");
    scene.add.existing(this);
    this.setScale(0.4);
    this.scene = scene;
    // var postFxPlugin = scene.plugins.get('rexGlowFilterPipeline');
    // (postFxPlugin as GlowFilterPipelinePlugin)
    //     .add(this, {
    //         distance: 15,
    //         glowColor: 0xF8D56B,
    //         quality: 0.1,
    //     });

    TweenHelper.floatEffect(scene, this);
  }

  disappearEffect(): void {
    let nbrLife = this.scene.registry.get("nbrLife");
    this.scene.registry.set("nbrLife", nbrLife + 1);
    TweenHelper.stopTweens();
    TweenHelper.getLifeEffect(this.scene, this);
  }

  update(player: Physics.Arcade.Sprite): void {
    if (this.state !== "destroyed") {
      // this.scene.add.rectangle(this.x, this.y, this.width * 0.4, this.height * 0.4).setStrokeStyle(2, 0x1a65ac);
      let width = this.width * 0.4;
      let height = this.height * 0.4;
      let px = player.body.x + player.body.width / 2;
      let py = player.body.y + player.body.height / 2;
      if (
        px + player.body.width >= this.x &&
        px <= this.x + width &&
        py + player.body.height >= this.y &&
        py <= this.y + height
      ) {
        this.state = "destroyed";
        this.disappearEffect();
      }
    }
  }
}
