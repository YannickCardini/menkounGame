import SceneEnums from "~/enums/SceneEnums";

export default class DialogScene extends Phaser.Scene {
  counter: number;

  constructor() {
    super(SceneEnums.death);
  }

  preload() {
    this.load.atlas("cat", "assets/player.png", "assets/player.json");
  }

  create(data: {x:number, y:number, flip: boolean}) {

    let player = this.add.sprite(
      data.x,
      data.y,
      "cat"
    ).setFlipX(data.flip);

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
        this.scene.stop();
    });
  }
}
