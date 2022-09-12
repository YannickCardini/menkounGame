import Phaser from 'phaser'
import LevelZero from './scenes/LevelZero';
import Menu from './scenes/Menu';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js'

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
    plugins: {
        global: [{
            key: 'rexGlowFilterPipeline',
            plugin: GlowFilterPipelinePlugin,
            start: true
        }],
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 800 },
			debug: true
		}

	},
	
	scene: [LevelZero,Menu]
}

export default new Phaser.Game(config)
