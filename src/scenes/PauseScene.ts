export default class PauseScene extends Phaser.Scene {

    pauseButton: Phaser.GameObjects.Image;

    constructor() {
        super('PauseScene');
    }

    preload() {
        this.load.image("play", "assets/play_button.png")
    }

    create(){
        this.pauseButton = this.add.image(this.game.canvas.width - 30, 25, 'play').setScrollFactor(0).setScale(0.15);

        this.pauseButton.setInteractive().on('pointerup', () => {
            this.scene.resume('LevelOne');
            this.scene.stop();
        })
    }
}
