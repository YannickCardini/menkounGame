import Phaser from 'phaser'
import LevelZero from './scenes/LevelZero';

const WIDTH = 620;
const HEIGHT = 320;


const widthHeight = {
	width: WIDTH,
	height: HEIGHT
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	scale: {
		// Fit to window
		mode: Phaser.Scale.FIT,
		// Center vertically and horizontally
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		//Max height and width
		max:widthHeight,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 800 },
			debug: true
		}

	},
	scene: [LevelZero]
}

export default new Phaser.Game(config)
