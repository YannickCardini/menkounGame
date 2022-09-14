import { Dialog } from "~/class/Dialog";

export default class DialogScene extends Phaser.Scene {

    pauseButton: Phaser.GameObjects.Image;
    counter = 0;

    constructor() {
        super('DialogScene');
    }

    preload() {
        this.load.image("player_sad", "assets/dialog_player_sad.png")
    }

    create() {
        this.add.image(0, 120, 'player_sad').setOrigin(0).setScale(0.5);
        let dialog = new Dialog(this, { windowHeight: 60, padding: 12, dialogSpeed: 3 });
        dialog.setText("Je hais cette forêt !!! ", true);

        this.input.on('pointerup', () => {
            if (this.counter === 0)
                dialog.setText("Et particulièrement tous ces horribles animaux. Il faut que je me dépêche de rejoindre Caporal Coon ...", true);
            if (this.counter >= 1){
                this.scene.resume('LevelOne');
                this.scene.stop();
            }
            this.counter++;
        }, this);
    }
    
}
