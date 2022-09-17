export default class PauseScene extends Phaser.Scene {

    pauseButton: Phaser.GameObjects.Image;

    constructor() {
        super('PauseScene');
    }

    preload() {
        this.load.image("play", "assets/play_button.png")
    }

    create(){
        let { width, height } = this.sys.game.canvas;
        let ratio = width / 620;
        this.pauseButton = this.add.image(width*0.94, height*0.1, 'play').setScrollFactor(0).setScale(0.15*ratio);

        this.pauseButton.setInteractive().on('pointerup', () => {
            this.scene.resume('LevelOne');
            this.scene.stop();
        })
    }
}
