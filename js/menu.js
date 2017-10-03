var Menu = {

	preload: function () {
		game.load.image('menu', 'images/Art/GUI/menu.png');

		game.load.video('video', 'images/Art/GUI/MenuVideo.mp4')
	},

	create: function () {
		this.add.button(0, 0, 'menu', this.startGame, this);

		var video = game.add.video('video');
		video.play(false);
		video.addToWorld(800, 450, 0.5, 0.5);
	},

	startGame: function () {

		this.state.start('Game');
	}

};