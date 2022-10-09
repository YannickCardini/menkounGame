import { Dialog, textAndImg } from "~/class/Dialog";
import SceneEnums from "~/enums/SceneEnums";

export default class DialogScene extends Phaser.Scene {

    counter: number;

    constructor() {
        super(SceneEnums.dialog);
    }

    preload() {
        this.load.image("player_sad", "assets/dialog/player_sad.png");
        this.load.image("player_happy", "assets/dialog/player_happy.png");
        this.load.image("pnj_serious", "assets/dialog/pnj_serious.png");
    }

    create(data: { textsAndImg: Array<textAndImg>, levelFinish?: boolean }) {
        let { width, height } = this.sys.game.canvas;
        this.counter = 0;
        let dialog = new Dialog(this, { windowHeight: width/10, padding: height/20, dialogSpeed: 4 });
        const tai = data.textsAndImg;
        dialog.setText(tai[this.counter].text, true, tai[this.counter].img, tai[this.counter].flipImg);
        this.input.on('pointerup', () => {
            if (dialog.animateFinish()) {
                this.counter++;
                if (this.counter >= tai.length) {
                    this.scene.resume(SceneEnums.levelOne);
                    this.scene.stop();
                }
                else
                    dialog.setText(tai[this.counter].text, true, tai[this.counter].img, tai[this.counter].flipImg);
            }
        }, this);

    }

}
