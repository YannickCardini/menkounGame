import { Physics } from "phaser";

export default class DialogScene extends Phaser.Scene {
  counter: number;

  constructor() {
    super("DeathScene");
  }

  preload() {
    this.load.atlas("cat", "assets/player.png", "assets/player.json");
  }

  create(data: {x:number, y:number}) {
    //   this.cameras.main.setBackgroundColor("#000000");
    let player = this.add.sprite(
      data.x,
      data.y,
      "cat"
    ).setScale(0.5);

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
        this.scene.resume('LevelOne');
        this.scene.stop();
    });
  }
}
