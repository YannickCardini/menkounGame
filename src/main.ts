import Phaser, { Scale } from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const WIDTH: number = 620;
const HEIGHT: number = 320;


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
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
