import Phaser from 'phaser'
import LevelZero from './scenes/LevelZero';
import Menu from './scenes/Menu';

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
	parent: "menkounGame",
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
			debug: false
		}

	},
	scene: [LevelZero,Menu]
}

export default new Phaser.Game(config)
