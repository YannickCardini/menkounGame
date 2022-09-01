import Phaser, { Scale } from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const widthHeight = {
	width: 620,
	height: 320
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 620,
	height: 320,
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
			gravity: { y: 500 }
		}
	},
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
