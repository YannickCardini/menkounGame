import { Physics } from "phaser";
import SceneEnums from "~/enums/SceneEnums";

export default class DialogScene extends Phaser.Scene {
  counter: number;

  constructor() {
    super(SceneEnums.death);
  }

  preload() {
    this.load.atlas("cat", "assets/player.png", "assets/player.json");
  }

  create(data: {x:number, y:number}) {
    let { ratio } = this.registry.get('canvas');
    //   this.cameras.main.setBackgroundColor("#000000");
    // this.cameras.main.zoomTo(ratio, 1, 'Linear', true);

    let player = this.add.sprite(
      data.x*ratio,
      data.y*ratio,
      "cat"
    ).setScale(0.5*ratio);

    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNames("cat", {
        prefix: "p1_dead",
        start: 1,
        end: 10,
        zeroPad: 2,
      }),
      frameRate: 1,
    });
    player.anims.play("dead", true).once('animationcomplete', ()=>{
        this.scene.resume(SceneEnums.levelOne);
        this.scene.stop();
    });
  }
}
