//texts
var gold
var goldText;
var fuel
var fuelText;
var speedXText;
var speedYText;
var speedText


var lifeUI = new Array();

var texts = {

	create: function(){
		
		//init text

        // gold = game.add.text(800, 820, 'GOLD', { font:'Aquatico-Regular', fontSize:'24px', fill:'#cea500'});
        // gold.anchor.setTo(0.5, 0);
        // gold.fixedToCamera = true;

        goldText = game.add.text(1520, 20, '0', { font:'Aquatico-Regular', fontSize:'35px', fill:'#cea500'});
        goldText.anchor.setTo(0.5, 0);
        goldText.fixedToCamera = true;
        //goldText.cssFont = "Aquatico-Regular";

        // fuel = game.add.text(800, 10, 'FUEL', { font:'Aquatico-Regular', fontSize:'24px', fill:'#00adfc'});
        // fuel.anchor.setTo(0.5, 0);
        // fuel.fixedToCamera = true;
        // //fuel.cssFont = "Aquatico-Regular";

        // fuelText = game.add.text(1520, 800, '0', { font:'Aquatico-Regular', fontSize:'35px', fill:'#043951'});
        // fuelText.anchor.setTo(0.5, 0);
        // fuelText.fixedToCamera = true;
        //fuelText.cssFont = "Aquatico-Regular";

        // speedXText = game.add.text(player.x + 30, player.y - 30, 'Vx: 0', {fontSize:'14px', fill:'#eeeeee'});
        // speedYText = game.add.text(player.x + 30, player.y - 15, 'Vy: 0', {fontSize:'14px', fill:'#eeeeee'});
        speedText = game.add.text(player.x + 35, player.y - 35, '0', {fontSize:'24px', fill:'#eeeeee'});

        for(var i = 0; i < 3; i++){
            lifeUI[i] = game.add.sprite(20, 700 + 60 * i, 'lifeOn');
            lifeUI[i].fixedToCamera = true;
        }

	},

	update: function(){
		
		goldText.text = '$' + goldNum + 'M';
        // fuelText.text = parseInt(player.fuel);
        speedText.reset(player.x + 35, player.y - 35);
        // speedXText.reset(player.x + 30, player.y - 30);
        // speedXText.text = 'Vx: ' + parseInt(player.body.velocity.x);
        // speedYText.reset(player.x + 30, player.y - 15);
        // speedYText.text = 'Vy: ' + parseInt(player.body.velocity.y);


        //speed check
        speed = Math.sqrt(Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2));
        speedText.text = parseInt(speed);
        if(speed > CRASH_SPEED){
            // speedXText.style.fill = "#ee0000";
            // speedYText.style.fill = "#ee0000";
            speedText.style.fill = "#ee0000";
            //player.animations.play('default', 5000, true);

        }
        else{
        	// speedXText.style.fill = "#eeeeee";
            // speedYText.style.fill = "#eeeeee";
            speedText.style.fill = "#eeeeee";
            // if(player.isAlert == true)
            // {
            // 	player.loadTexture('player');
            // 	player.isAlert = false;
            // 	console.log("change texture");
            // }
        }

	}

}

function rebirthUI(){

    if(player.lives == 2)
        lifeUI[0].loadTexture('lifeOff');
    else if(player.lives == 1)
        lifeUI[1].loadTexture('lifeOff');

}