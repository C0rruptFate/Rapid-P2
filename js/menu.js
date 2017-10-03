var Menu = {

	preload: function () {
		
		game.load.image('menu', 'images/Art/GUI/menu.png');

		//load video
        game.load.video('video', 'images/Art/GUI/MenuVideo.mov')
	},

	create: function () {
		this.add.button(0, 0, 'menu', this.startGame, this);
	},

	startGame: function () {

		this.state.start('Game');
	}

};