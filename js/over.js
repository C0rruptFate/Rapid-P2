var Over = {

	preload: function () {
		game.load.image('over', 'images/Art/GUI/over.png');
	},

	create: function () {
		this.add.button(0, 0, 'over', this.startGame, this);
	},

	startGame: function () {

		this.state.start('Game');
	}

};