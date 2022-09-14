import { Scene } from "phaser";

export class TweenHelper {

    static flash: Phaser.Tweens.Timeline;
    static getLife: Phaser.Tweens.Tween;

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

    static getLifeEffect(scene: Scene, target: Phaser.GameObjects.Image | Phaser.GameObjects.Text,): void {
        this.getLife = scene.tweens.add(
            {
                targets: target, scale: 0.7, duration: 200, ease: 'Linear', onComplete: () => {
                    scene.tweens.add({
                        targets: target, x: 20, y: 20, scale: 0.3, duration: 500, ease: 'Linear', onComplete: () => {
                            target.destroy()
                        }
                    });
                }
            });
    }

}