import { Scene } from "phaser";

export class TweenHelper {
    static flashElement(scene: Scene, element: Phaser.GameObjects.Image | Phaser.GameObjects.Text, repeat = 2, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 100) {
        if (scene && element) {
            const flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
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
}