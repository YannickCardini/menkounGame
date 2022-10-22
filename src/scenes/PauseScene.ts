import SceneEnums from "~/enums/SceneEnums";

export default class PauseScene extends Phaser.Scene {

    pauseButton: Phaser.GameObjects.Image;

    constructor() {
        super(SceneEnums.pause);
    }

    preload() {
        this.load.image("play", "assets/ui/play_button.png")
    }

    create(data: {scene: string}){
        let { width, height, ratio } = this.registry.get('canvas');
        this.pauseButton = this.add.image(width*0.94, height*0.1, 'play').setScrollFactor(0).setScale(0.15*ratio);

        this.pauseButton.setInteractive().on('pointerup', () => {
            this.scene.resume(data.scene);
            this.scene.stop();
        })
    }
}
