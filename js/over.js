var openChest;

var Over = {

	preload: function () {

		if(!ifWin)
			game.load.image('over', 'images/Art/GUI/over.png');
		else
		{	
			game.load.image('over', 'images/Art/GUI/background.png');
			game.load.spritesheet('openChest', 'images/Art/GUI/GUI_endingSpriteSheet 520x900 120.png', 520, 900, 120)
		}


	},

	create: function () {

		this.add.button(0, 0, 'over', this.startGame, this);
		openChest = this.add.sprite(800, 450, 'openChest');
		openChest.anchor.setTo(0.5, 0.5);
		openChest.animations.add('open');
		openChest.animations.play('open', 20, true);


	},

	startGame: function () {

		this.state.start('Game');
	}

};