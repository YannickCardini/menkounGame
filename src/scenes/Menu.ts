import { Physics } from "phaser"
import LevelZero from "./LevelZero"

export default class Menu extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image
    private fontSize: number
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super('main-menu')
        this.fontSize = 30
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.image('glass-panel', 'assets/menu/glassPanel.png')
        this.load.image('metal-panel', 'assets/menu/metalPanel.png')
        this.load.image('cursor-hand', 'assets/menu/cursor_hand.png')
        this.load.bitmapFont('atari', 'assets/menu/atari-smooth.png', 'assets/menu/atari-smooth.xml');
        this.load.bitmapFont('ice', 'assets/menu/iceicebaby.png', 'assets/menu/iceicebaby.xml');
        this.load.video('demo', 'assets/menu/galaxy.mp4');
        this.load.atlas('cat', 'assets/cat-0.png', 'assets/cat.json');

    }

    create() {

        let { width, height } = this.sys.game.canvas;



        var vid = this.add.video(310, 160, 'demo');

        vid.play(true);
        
        // Prevents video freeze when game is out of focus (i.e. user changes tab on the browser)
        vid.setPaused(false);

        this.player = this.physics.add.sprite(60, 280, 'cat').setScale(0.5)
        this.player.body.setAllowGravity(false)

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_walk', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });


        const noTintText = this.add.bitmapText(48, 110, 'ice', 'MENKOUN.FR', 56);
        const tintedText = this.add.bitmapText(48, 165, 'ice', 'THE GAME', 56);

        tintedText.setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000);

        // Play button
        const playButton = this.add.image(width * 0.8, height * 0.3, 'metal-panel')
            .setDisplaySize(150, 50)

        this.add.bitmapText(playButton.x, playButton.y, 'ice', 'Jouer', this.fontSize).setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000)
            .setOrigin(0.5,0.42)

        // Settings button
        const donnerButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(150, 50)

        this.add.bitmapText(donnerButton.x, donnerButton.y, 'ice', 'Donner', this.fontSize).setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000)
            .setOrigin(0.5,0.42)

        // Credits button
        const adoptButton = this.add.image(donnerButton.x, donnerButton.y + donnerButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(150, 50)

        this.add.bitmapText(adoptButton.x, adoptButton.y, 'ice', 'Adopter', this.fontSize).setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000)
            .setOrigin(0.5,0.42)

        this.buttons.push(playButton)
        this.buttons.push(donnerButton)
        this.buttons.push(adoptButton)

        this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
        this.selectButton(0)

        playButton.on('selected', () => {
            tintedText.setText('THE GAME')
        })

        donnerButton.on('selected', () => {
            tintedText.setText('/poster\n-une-annonce')
        })

        adoptButton.on('selected', () => {
            tintedText.setText('/adoption')
        })

        playButton.on('confirm', () => {
            console.log("play button pressed")
            this.scene.start('LevelZero')
        })

        donnerButton.on('confirm', () => {
            location.href = 'https://menkoun.fr/poster-une-annonce'
        })

        adoptButton.on('confirm', () => {
            location.href = 'https://menkoun.fr/adoption'
        })

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            playButton.off('selected')
            donnerButton.off('selected')
            adoptButton.off('selected')

        })

    }

    selectButton(index: number) {
        const currentButton = this.buttons[this.selectedButtonIndex]

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff)

        const button = this.buttons[index]

        button.emit('selected')

        // set the newly selected button to a green tint
        button.setTint(0x66ff7f)

        // move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5
        this.buttonSelector.y = button.y + 10

        // store the new selected index
        this.selectedButtonIndex = index
    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change

        // wrap the index to the front or end of array
        if (index >= this.buttons.length) {
            index = 0
        }
        else if (index < 0) {
            index = this.buttons.length - 1
        }

        this.selectButton(index)
    }

    confirmSelection() {
        // get the currently selected button
        const button = this.buttons[this.selectedButtonIndex]

        // emit the 'selected' event
        button.emit('confirm')
    }

    update() {

        this.player.anims.play("walk", true);
        const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)

        if (upJustPressed) {
            this.selectNextButton(-1)
        }
        else if (downJustPressed) {
            this.selectNextButton(1)
        }
        else if (spaceJustPressed) {
            this.confirmSelection()
        }
    }
}
