var input;

var inputManager = {

	create: function()
	{
		input = game.input.keyboard.createCursorKeys();

        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function(){
            if(player.engineLevel < 3)
                player.engineLevel++;
            //console.log(player.engineLevel);
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function(){
            if(player.engineLevel > 0)
                player.engineLevel--;
            //console.log(player.engineLevel);
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onHoldCallback = function(){
            player.body.angularVelocity -= 0.1;
        }

        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onHoldCallback = function(){
            player.body.angularVelocity += 0.1;
        }
	},

	update: function()
	{

	}

}