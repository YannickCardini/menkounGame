import { Scene } from "phaser";
import Phaser from 'phaser'

export interface textAndImg {
    text: string;
    img: string;
    flipImg?: boolean,
}

export class Dialog {

    scene: Scene;
    systems: Phaser.Scenes.Systems;
    borderThickness: number;
    borderColor: number;
    borderAlpha: number;
    windowAlpha: number;
    windowColor: number;
    windowHeight: number;
    padding: number;
    closeBtnColor: string;
    private _dialogSpeed: number;
    eventCounter: number;
    visible: boolean;
    text: Phaser.GameObjects.Text;
    dialog: string[];
    graphics: Phaser.GameObjects.Graphics;
    closeBtn: Phaser.GameObjects.Text;
    timedEvent: Phaser.Time.TimerEvent;
    img: Phaser.GameObjects.Image;

    constructor(scene: Scene, opts?: any) {
        // the scene that owns the plugin
        this.scene = scene;
        this.systems = scene.sys;
        if (!scene.sys.settings.isBooted) {
            scene.sys.events.once('boot', this.boot, this);
        }
        // Check to see if any optional parameters were passed
        if (!opts) opts = {};
        // set properties from opts object or use defaults
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x907748;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowAlpha = opts.windowAlpha || 1;
        this.windowColor = opts.windowColor || 0x303030;
        this.windowHeight = opts.windowHeight || 150;
        this.padding = opts.padding || 32;
        this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
        this.dialogSpeed = opts.dialogSpeed || 3;
        // used for animating the text
        this.eventCounter = 0;
        // if the dialog window is shown
        this.visible = true;
        // the current text in the window
        this.text;
        // the text that will be displayed in the window
        this.dialog;
        this.graphics;
        this.closeBtn;
        // Create the dialog window
        this._createWindow();
    }

    // Slowly displays the text in the window to make it appear annimated
    _animateText(): void {
        this.eventCounter++;
        this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
        if (this.eventCounter === this.dialog.length) {
            this.timedEvent.remove();
        }
    }

    animateFinish(): boolean{
        return this.eventCounter === this.dialog.length;
    }

    boot(): void {
        var eventEmitter = this.systems.events;
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    }

    // Calculates where to place the dialog window based on the game size
    _calculateWindowDimensions(width: number, height: number): { x: number, y: number, rectWidth: number, rectHeight: number } {
        var x = this.padding;
        var y = height - this.windowHeight - this.padding;
        var rectWidth = width - (this.padding * 2);
        var rectHeight = this.windowHeight;
        return {
            x,
            y,
            rectWidth,
            rectHeight
        };
    }

    // Creates the close dialog window button
    _createCloseModalButton(): void {
        var self = this;
        let style: Phaser.Types.GameObjects.Text.TextStyle = {
            font: 'bold 12px Arial',
            color: this.closeBtnColor
        }
        this.closeBtn = this.scene.make.text({
            x: this._getGameWidth() - this.padding - 14,
            y: this._getGameHeight() - this.windowHeight - this.padding + 3,
            text: 'X',
            style: style
        }).setScrollFactor(0);
        this.closeBtn.setInteractive();
        this.closeBtn.on('pointerover', function (this: Phaser.GameObjects.Text) {
            this.setTint(0xff0000);
        });
        this.closeBtn.on('pointerout', function (this: Phaser.GameObjects.Text) {
            this.clearTint();
        });
        this.closeBtn.on('pointerdown', function () {
            self.toggleWindow();
            if (self.timedEvent) self.timedEvent.remove();
            if (self.text) self.text.destroy();
        });
    }

    // Creates the close dialog button border
    _createCloseModalButtonBorder(): void {
        var x = this._getGameWidth() - this.padding - 20;
        var y = this._getGameHeight() - this.windowHeight - this.padding;
        this.graphics.strokeRect(x, y, 20, 20).setScrollFactor(0);
    }

    _createImg(): void{
        this.img  = this.scene.add.image(0, 120, 'player_sad').setOrigin(0);
    }

    // Creates the dialog window
    _createWindow(): void {
        var gameHeight = this._getGameHeight();
        var gameWidth = this._getGameWidth();
        var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
        this._createImg();
        this.graphics = this.scene.add.graphics();
        this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
        // this._createCloseModalButton();
        // this._createCloseModalButtonBorder();
    }

    // Creates the inner dialog window (where the text is displayed)
    _createInnerWindow(x: number, y: number, rectWidth: number, rectHeight: number): void {
        this.graphics.fillStyle(this.windowColor, this.windowAlpha).setScrollFactor(0);
        this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1).setScrollFactor(0);
    }
    // Creates the border rectangle of the dialog window
    _createOuterWindow(x: number, y: number, rectWidth: number, rectHeight: number): void {
        this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha).setScrollFactor(0);
        this.graphics.strokeRect(x, y, rectWidth, rectHeight).setScrollFactor(0);
    }

    // called when a Scene is destroyed by the Scene Manager
    destroy(): void {
        this.shutdown();
    }

    public get dialogSpeed(): number {
        return this._dialogSpeed;
    }
    public set dialogSpeed(value: number) {
        this._dialogSpeed = value;
    }


    // Gets the width of the game (based on the scene)
    _getGameWidth(): number {
        return Number(this.scene.sys.game.config.width);
    }
    // Gets the height of the game (based on the scene)
    _getGameHeight(): number {
        return Number(this.scene.sys.game.config.height);
    }

    // Sets the text for the dialog window
    setText(text: string, animate: boolean, img: string, flipImg?: boolean): void {
        // reset the img
        let { width, height } = this.scene.sys.game.canvas;
        this.img.setTexture(img);
        this.img.y = height - this.img.height/(1240/width);
        this.img.setScale(width/1240);

        if(flipImg){
            this.img.flipX = true;
            this.img.x = width - this.img.width/(1240/width);
        }
        else{
            this.img.flipX = false;
            this.img.x = 1;
        }
        // Reset the dialog
        this.eventCounter = 0;
        this.dialog = text.split('');
        if (this.timedEvent) this.timedEvent.remove();
        var tempText = animate ? '' : text;
        this._setText(tempText);
        if (animate) {
            this.timedEvent = this.scene.time.addEvent({
                delay: 150 - (this.dialogSpeed * 30),
                callback: this._animateText,
                callbackScope: this,
                loop: true
            });
        }
    }

    // Calcuate the position of the text in the dialog window
    _setText(text: string): void {
        // Reset the dialog
        if (this.text) this.text.destroy();
        var x = this.padding + 10;
        var y = this._getGameHeight() - this.windowHeight - this.padding + 10;
        this.text = this.scene.make.text({
            x,
            y,
            text,
            style: {
                wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 },
                fontSize: (this.scene.sys.canvas.height/20).toString() + 'px'
            }
        }).setScrollFactor(0);
    }

    //  Called when a Scene shuts down, it may then come back again later
    // (which will invoke the 'start' event) but should be considered dormant.
    shutdown(): void {
        if (this.timedEvent) this.timedEvent.remove();
        if (this.text) this.text.destroy();
    }

    // Hide/Show the dialog window
    toggleWindow(): void {
        this.visible = !this.visible;
        if (this.text) this.text.visible = this.visible;
        if (this.graphics) this.graphics.visible = this.visible;
        if (this.closeBtn) this.closeBtn.visible = this.visible;
    }


}



