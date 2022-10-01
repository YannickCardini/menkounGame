import { Scene } from "phaser";

export class TweenHelper {

    static flash: Phaser.Tweens.Timeline;
    // static getLife: Phaser.Tweens.Tween;
    static float: Phaser.Tweens.Tween;


    static flashElement(scene: Scene, element: Phaser.GameObjects.Image | Phaser.GameObjects.Text, repeat = 2, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 100) {
        if (scene && element) {
            const flashDuration = overallDuration - visiblePauseDuration / 2;

            this.flash = scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 0,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: visiblePauseDuration,
                        alpha: 0,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing,
                        onComplete: () => {
                            if (repeat !== 0) {
                                this.flashElement(scene, element, repeat - 1);
                            }
                        }
                    }
                ]
            });
        }
    }

    static floatEffect(scene: Scene, target: Phaser.GameObjects.Image): void {
        this.float = scene.tweens.add({
            targets: target,
            y: target.y-10,
            ease: 'Linear',
            duration: 2000,
            repeat: -1,
            yoyo: true
        });
    }

    // static getLifeEffect(scene: Scene, target: Phaser.GameObjects.Image | Phaser.GameObjects.Text): void {
    //     let {ratio} = scene.registry.get('canvas');
    //     this.getLife = scene.tweens.add(
    //         {
    //             targets: target, scale: 0.7, duration: 200, ease: 'Linear', onComplete: () => {
    //                 scene.tweens.add({
    //                     targets: target, x: 21*ratio + scene.cameras.main.worldView.x, y: 21*ratio + scene.cameras.main.worldView.y, scale: 0.3, duration: 500, ease: 'Linear', onComplete: () => {
    //                         target.destroy()
    //                     }
    //                 });
    //             }
    //         });
    // }

    static stopTweens(): void {
        // if (this.getLife)
        //     this.getLife.stop();
        if (this.float)
            this.float.stop();
        if (this.flash)
            this.flash.stop();

    }

}