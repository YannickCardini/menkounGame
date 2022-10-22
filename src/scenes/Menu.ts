import SceneEnums from "~/enums/SceneEnums";

export default class Menu extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private buttons: Phaser.GameObjects.Image[] = []
    private selectedButtonIndex = 0
    private buttonSelector!: Phaser.GameObjects.Image
    private fontSize: number;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super(SceneEnums.menu)
    }

    preload() {
        this.load.image('metal-panel', 'assets/menu/metalPanel.png');
        this.load.image('cursor-hand', 'assets/menu/cursor_hand.png');
        this.load.atlas('cat', 'assets/player.png', 'assets/player.json');
        this.load.image('clouds', 'assets/menu/clouds.png');
        this.load.image('poteau', 'assets/menu/poteau.png');
        this.load.image('ground', 'assets/menu/menu_ground.png');
        this.load.image('logo', 'assets/menu/menkounLogo.png');
        this.load.bitmapFont('desyrel', 'assets/menu/desyrel.png', 'assets/menu/desyrel.xml');
    }

    create() {

        let { width, height } = this.sys.game.canvas;
        this.registry.set('canvas', {width: width, height: height, ratio: width/620});

        this.fontSize = height/10;
        this.buttons = [];
        this.cursors = this.input.keyboard?.createCursorKeys()!;
        this.selectedButtonIndex = 0
        this.fontSize = width/20;

        var clouds = this.add.image(width/6, height/10, 'clouds').setOrigin(0).setPipeline('Light2D');

        this.tweens.add({
            targets: clouds,
            x: -width*2,
            ease: 'Linear',
            duration: 400000,
            repeat: -1
        });

        var ground = this.add.image(width / 2, height / 2, 'ground');
        ground.setScale(width/ground.width);
        ground.setPipeline('Light2D');

        // var pic = this.add.image(100, 240, 'poteau');
        // pic.setPipeline('Light2D');

        this.lights.enable().setAmbientColor(0x333333);
        this.lights.addLight(width*0.19, height*0.72, 200).setIntensity(2);

        // We must enable the light system. By default is disabled
        this.lights.enable();

        this.player = this.physics.add.sprite(width/10, height*0.82, 'cat');
        this.player.setScale((width*0.11)/this.player.width);
        this.player.body.setAllowGravity(false);
        this.player.setPipeline('Light2D');

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNames('cat', { prefix: 'p1_idle', start: 1, end: 10, zeroPad: 2 }),
            frameRate: 10,
            repeat: -1
        });

        let logo = this.add.image(width/3, height/5, 'logo');
        logo.setScale((width/2)/logo.width);
        const tintedText = this.add.bitmapText(width/10, height/3, 'desyrel', '', this.fontSize).setTint(0xffa500, 0xffa500, 0xffa500, 0xffa500);

        // Play button
        const playButton = this.add.image(width * 0.8, height * 0.3, 'metal-panel')
            .setDisplaySize(width/4, height/6).setInteractive({ cursor: 'pointer' });

        this.add.bitmapText(playButton.x, playButton.y, 'desyrel', 'Jouer', this.fontSize)
            .setOrigin(0.5, 0.5);

        // Settings button
        const donnerButton = this.add.image(playButton.x, playButton.y + playButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(width/4, height/6).setInteractive({ cursor: 'pointer' });

        this.add.bitmapText(donnerButton.x, donnerButton.y, 'desyrel', 'Donner', this.fontSize)
            .setOrigin(0.5, 0.5);

        // Credits button
        const adoptButton = this.add.image(donnerButton.x, donnerButton.y + donnerButton.displayHeight + 10, 'metal-panel')
            .setDisplaySize(width/4, height/6).setInteractive({ cursor: 'pointer' });

        this.add.bitmapText(adoptButton.x, adoptButton.y, 'desyrel', 'Adopter', this.fontSize)
            .setOrigin(0.5, 0.5);

        this.buttons.push(playButton);
        this.buttons.push(donnerButton);
        this.buttons.push(adoptButton);

        this.buttonSelector = this.add.image(0, 0, 'cursor-hand');
        this.buttonSelector.setScale(width/620)
        this.selectButton(0);

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
            this.registry.set('nbrLife', 3);
            this.scene.start(SceneEnums.levelTwo);
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
            this.input.off('pointerup')
        });
    }

    selectButton(index: number) {
        const currentButton = this.buttons[this.selectedButtonIndex];

        // set the current selected button to a white tint
        currentButton.setTint(0xffffff);

        const button = this.buttons[index];

        // set the newly selected button to a green tint
        button.setTint(0x66ff7f);

        button.emit('selected');

        // move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5;
        this.buttonSelector.y = button.y + 10;

        // store the new selected index
        this.selectedButtonIndex = index;
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
        this.player.anims.play("idle", true);
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
