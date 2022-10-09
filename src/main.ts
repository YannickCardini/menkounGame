import Phaser from "phaser";
import Menu from "./scenes/Menu";
import LevelOne from "./scenes/LevelOne";
import PauseScene from "./scenes/PauseScene";
import DialogScene from "./scenes/DialogScene";
import DeathScene from "./scenes/DeathScene";
import ParticleEffects from "./scenes/ParticleEffects";
import { Debug } from "./debug.mode";

const WIDTH = 1240;
const HEIGHT = 640;

console.log("version 1");

const widthHeight = {
  width: WIDTH,
  height: HEIGHT,
};


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
  fps: {
    smoothStep: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: Debug.MODE,
    },
  },

  scene: [Menu, LevelOne, PauseScene, DialogScene, DeathScene, ParticleEffects],
};

export default new Phaser.Game(config);
