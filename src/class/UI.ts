import { Scene } from "phaser";
import { TweenHelper } from "./TweenHelper";

export class UI extends Phaser.GameObjects.Container {

    lifeImg: Phaser.GameObjects.Image;
    lifeText: Phaser.GameObjects.Text;
    scene: Scene;
    jumpButton: Phaser.GameObjects.Image;
    slideButton: Phaser.GameObjects.Image;
    rightButton: Phaser.GameObjects.Image;
    leftButton: Phaser.GameObjects.Image;

    constructor(scene: Scene) {
        super(scene);
        let { width, height, ratio } = scene.registry.get('canvas');
        this.scene = scene;
        // Add life counter at the top left corner     
        const style: Phaser.Types.GameObjects.Text.TextStyle = { color: "#ffb000", strokeThickness: 1 * ratio, stroke: "#000000", fontSize: (height / 20).toString() + 'px' }
        this.lifeImg = scene.add.image(25 * ratio, 25 * ratio,  'life').setScrollFactor(0).setScale(0.3 * ratio);
        this.lifeText = scene.add.text(this.lifeImg.x + 15 * ratio, this.lifeImg.y - 5 * ratio, "x" + scene.registry.get('nbrLife').toString(), style).setScrollFactor(0);
        let pauseButton = scene.add.image(width*0.94,height*0.1, 'pause').setScrollFactor(0).setScale(0.15*ratio);

        pauseButton.setInteractive().on('pointerup', () => {
            // @ts-ignore
            scene.cameras.main.fadeEffect.alpha = 0.3;
            scene.scene.pause();
            scene.scene.launch('PauseScene');
        });

        if (!scene.sys.game.device.os.desktop) {
            this.jumpButton = scene.add.image(width*0.83, height*0.75, 'jump_button').setScrollFactor(0).setInteractive(scene.input.makePixelPerfect()).setScale(0.25*ratio);
            this.slideButton = scene.add.image(this.jumpButton.x + 50*ratio, this.jumpButton.y + 45*ratio, 'slide_button').setScrollFactor(0).setInteractive(scene.input.makePixelPerfect()).setScale(0.25*ratio);
            this.leftButton = scene.add.image(width*0.1, this.slideButton.y, 'left_button').setScrollFactor(0).setInteractive(scene.input.makePixelPerfect()).setScale(0.25*ratio);
            this.rightButton = scene.add.image(this.leftButton.x + 70*ratio, this.leftButton.y, 'right_button').setScrollFactor(0).setInteractive(scene.input.makePixelPerfect()).setScale(0.25*ratio);

            this.jumpButton.on('pointerdown',()=>{
                scene.events.emit('jumpPressed');
            });
            this.slideButton.on('pointerdown',()=>{
                scene.events.emit('slidePressed');
            });
            this.leftButton.on('pointerdown',()=>{
                scene.events.emit('leftPressed');
            });
            this.rightButton.on('pointerdown',()=>{
                scene.events.emit('rightPressed');
            });

            this.add(this.jumpButton);
            this.add(this.slideButton);
            this.add(this.leftButton);
            this.add(this.rightButton);

        }


        this.add(this.lifeImg);
        this.add(this.lifeText);
        this.add(pauseButton);

        this.scene.add.existing(this);

        scene.registry.events.on('changedata', this.registryEvents, this);
    }

    lifeBlink(): void {
        TweenHelper.flashElement(this.scene, this.lifeImg);
        TweenHelper.flashElement(this.scene, this.lifeText);
    }

    registryEvents(parent: Phaser.Game, key: string, data: boolean | number) {
        if (key === 'nbrLife' && this.lifeText) {
            this.lifeText.setText("x" + data.toString());
            TweenHelper.flashElement(this.scene, this.lifeText);
            TweenHelper.flashElement(this.scene, this.lifeImg);
        }
    }

    unsubscribe(): void{
        this.leftButton.off('leftPressed');
        this.rightButton.off('rightPressed');
        this.jumpButton.off('jumpPressed');
        this.slideButton.off('slidePressed');

    }

}