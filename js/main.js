    var WINDOW_WIDTH = 1600;
    var WINDOW_HEIGHT = 900

    var game
    
    game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.CANVAS, '');
        
    //rigister states
    game.state.add('Menu', Menu);
    game.state.add('Game', Game);
    game.state.add('Over', Over);
    
    game.state.start('Menu');

