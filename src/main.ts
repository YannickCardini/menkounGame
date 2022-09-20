import Phaser from 'phaser'
import LevelZero from './scenes/LevelZero';
import Menu from './scenes/Menu';
import GlowFilterPipelinePlugin from 'phaser3-rex-plugins/plugins/glowfilter2pipeline-plugin.js'
import LevelOne from './scenes/LevelOne';
import PauseScene from './scenes/PauseScene';
import DialogScene from './scenes/DialogScene';

const WIDTH = 1240;
const HEIGHT = 640;

console.log('version 1')


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
		// max:widthHeight,
	},
	fps:{
		smoothStep: true,
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
			debug: false
		}

	},
	
	scene: [Menu,LevelOne,PauseScene,DialogScene]
}

export default new Phaser.Game(config)
