var input;

var ifWin = false;

var inputManager = {

	create: function()
	{
		input = game.input.keyboard.createCursorKeys();

        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function()
        {
            if(player.engineLevel < 3 && player.fuel > 0)
                player.engineLevel++;
            //console.log(player.engineLevel);
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function()
        {
            if(player.engineLevel > 0)
                player.engineLevel--;
            //console.log(player.engineLevel);
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onHoldCallback = function()
        {
        	if(player.body.angularVelocity > 0)
        		player.body.angularVelocity = 0;
            player.body.angularVelocity -= 0.1;
        }

        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onHoldCallback = function()
        {
        	if(player.body.angularVelocity < 0)
        		player.body.angularVelocity = 0;
            player.body.angularVelocity += 0.1;
        }

        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function()
        {

            //change ship
            if(player.lives > 1){
            	player.lives -= 1;
            	rebirth();
            }
            else{
            	if(goldNum >= 0){
            		victory();
            	}
            	else
            		gameOver();
            }

        }, this);

	},

	update: function()
	{

	}

}

function victory(){

	ifWin = true;
	victorySFX.play();
	gameOver();        
}