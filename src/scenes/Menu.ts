export default class Menu extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image
    private fontSize: number
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super('menu')
        this.fontSize = 30
    }

    init() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    preload() {
        this.load.image('metal-panel', 'assets/menu/metalPanel.png')
        this.load.image('cursor-hand', 'assets/menu/cursor_hand.png')
        this.load.atlas('cat', 'assets/cat-0.png', 'assets/cat.json');
        this.load.image('clouds', 'assets/menu/clouds.png');
        this.load.image('poteau', 'assets/menu/poteau.png')
        this.load.image('ground','assets/menu/menu_ground.png')
        this.load.image('logo','assets/menu/menkounLogo.png')
        this.load.bitmapFont('desyrel', 'assets/menu/desyrel.png', 'assets/menu/desyrel.xml');
    }

    create() {

        let { width, height } = this.sys.game.canvas;

        var clouds = this.add.image(100, 32, 'clouds').setOrigin(0).setPipeline('Light2D');

        this.tweens.add({
            targets: clouds,
            x: -1250,
            ease: 'Linear',
            duration: 400000,
            repeat: -1
        });

        var ground = this.add.image(width/2,height/2,'ground')
        ground.setPipeline('Light2D');

        var pic = this.add.image(100, 240, 'poteau');
        pic.setPipeline('Light2D');

        this.lights.enable().setAmbientColor(0x333333);
        var light = this.lights.addLight(115, 226, 200).setIntensity(2);

        this.tweens.add({
            targets: [ light ],
            y: 200,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 3000
        });

        // We must enable the light system. By default is disabled
        this.lights.enable();

        this.player = this.physics.add.sprite(60, 260, 'cat').setScale(0.5)
        this.player.body.setAllowGravity(false)
        this.player.setPipeline('Light2D')

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_walk', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.add.image(170,60,'logo').setScale(0.2)
        const tintedText = this.add.bitmapText(30, 90, 'desyrel', '', 40).setTint(0xffa500,0xffa500,0xffa500,0xffa500);

        // tintedText;

        // Play button
        const playButton = this.add.image(width * 0.8, height * 0.3, 'metal-panel')
            .setDisplaySize(150, 50).setInteractive({ cursor: 'pointer' });

        this.add.bitmapText(playButton.x, playButton.y, 'desyrel', 'Jouer', this.fontSize)
            .setOrigin(0.5, 0.5)

        // Settings button
        const donnerButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(150, 50).setInteractive({ cursor: 'pointer' })

        this.add.bitmapText(donnerButton.x, donnerButton.y, 'desyrel', 'Donner', this.fontSize)
            .setOrigin(0.5, 0.5)

        // Credits button
        const adoptButton = this.add.image(donnerButton.x, donnerButton.y + donnerButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(150, 50).setInteractive({ cursor: 'pointer' });

        this.add.bitmapText(adoptButton.x, adoptButton.y, 'desyrel', 'Adopter', this.fontSize)
            .setOrigin(0.5, 0.5)

        this.buttons.push(playButton)
        this.buttons.push(donnerButton)
        this.buttons.push(adoptButton)

        this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
        this.selectButton(0)

        playButton.on('selected', () => {
            tintedText.setText('THE GAME')
        })

        donnerButton.on('selected', () => {
            tintedText.setText('/donation')
        })

        adoptButton.on('selected', () => {
            tintedText.setText('/adoption')
        })

        playButton.on('pointerover', () => {
            tintedText.setText('THE GAME')
            this.selectButton(0)
        })

        donnerButton.on('pointerover', () => {
            tintedText.setText('/donation')
            this.selectButton(1)
        })

        adoptButton.on('pointerover', () => {
            tintedText.setText('/adoption')
            this.selectButton(2)
        })

        playButton.on('confirm', () => {
            console.log("play button pressed")
            this.scene.start('LevelZero')
        })

        donnerButton.on('confirm', () => {
            location.href = 'https://menkoun.fr/donation'
        })

        adoptButton.on('confirm', () => {
            location.href = 'https://menkoun.fr/adoption'
        })

        this.input.on('pointerup', () => {
            this.confirmSelection();
        }, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            playButton.off('pointerover')
            donnerButton.off('pointerover')
            adoptButton.off('pointerover')
            playButton.off('selected')
            donnerButton.off('selected')
            adoptButton.off('selected')
            playButton.off('confirm')
            donnerButton.off('confirm')
            adoptButton.off('confirm')
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
        else if (spaceJustPressed ) {
            this.confirmSelection()
        }
    }
}
