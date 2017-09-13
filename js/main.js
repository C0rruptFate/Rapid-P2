
    var game
    
    game = new Phaser.Game(1600, 900, Phaser.AUTO, '');
        
    //rigister states
    game.state.add('Game', Game);
    
    game.state.start('Game');

