//texts
var scoreText;
var fuelText;
var speedXText;
var speedYText;

var texts = {

	create: function(){
		
		//init text

        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize:'24px', fill:'#eeeeee'});
        scoreText.fixedToCamera = true;

        fuelText = game.add.text(16, 48, 'Fuel: 0', {fontSize:'24px', fill:'#eeeeee'});
        fuelText.fixedToCamera = true;

        speedXText = game.add.text(player.x + 30, player.y - 30, 'Vx: 0', {fontSize:'14px', fill:'#eeeeee'});
        speedYText = game.add.text(player.x + 30, player.y - 15, 'Vy: 0', {fontSize:'14px', fill:'#eeeeee'});

	},

	update: function(){
		
		scoreText.text = 'Score: ' + score;
        fuelText.text = 'Fuel: ' + player.fuel;
        speedXText.reset(player.x + 30, player.y - 30);
        speedXText.text = 'Vx: ' + parseInt(player.body.velocity.x);
        speedYText.reset(player.x + 30, player.y - 15);
        speedYText.text = 'Vy: ' + parseInt(player.body.velocity.y);

        //speed check
        speed = Math.sqrt(Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2));
        if(speed > 100){
            speedXText.style.fill = "#dd0000";
            speedYText.style.fill = "#dd0000";
        }
        else{
        	speedXText.style.fill = "#eeeeee";
            speedYText.style.fill = "#eeeeee";
        }

	}

}