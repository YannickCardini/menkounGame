import { Physics, Scene } from "phaser";
import SceneEnums from "~/enums/SceneEnums";
import { TweenHelper } from "./TweenHelper";

export class Life extends Phaser.GameObjects.Image {
  scene: Scene;
  nbrLife: number;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "life");
    scene.add.existing(this);
    this.setScale(0.4);
    this.scene = scene;
    TweenHelper.floatEffect(scene, this);
  }

  disappearEffect(): void {
    let {ratio} = this.scene.registry.get('canvas');
    let nbrLife = this.scene.registry.get("nbrLife");
    this.scene.registry.set("nbrLife", nbrLife + 1);
    TweenHelper.stopTweens();
    const particleEffects = this.scene.scene.get(SceneEnums.particle)
    particleEffects.events.emit('trail-to', {
      x: this.x,
      y: this.y,
      toX: 25 * ratio,
      toY: 25 * ratio
    });
    this.destroy();
    // TweenHelper.getLifeEffect(this.scene, this);
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
