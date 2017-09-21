//game components
var input;
var player;
var bg;
var ground;
var emitter;
var timer;

//texts
var scoreText;
//var timeText;
var fuelText;
//var altiText;
var speedXText;
var speedYText;


//game data
var score = 0;
var time = 0;

//constants
var PI = 3.1416;
var R = 180/PI;

var Game = {

    preload: function () {

        game.load.image('bg', 'images/Art/Environment/grey_background.png');
        game.load.image('ground', 'images/Art/Environment/Sides.png');
        game.load.image('player', 'images/Art/Player/PLA_Default');  
        game.load.image('particle', 'images/particle.png');

        game.load.physics('groundPolData', 'js/groundPolData.json');

    },

    create: function () {

        game.world.setBounds(0, 0, 1600, 10240);
        //set sprites 
        bg = game.add.tileSprite(0, 0, 1600, 10240, 'bg');
        ground = game.add.tileSprite(0, 0, 1600, 10240, 'ground');
        //ground.anchor.setTo(0.5, 0);
        player = game.add.sprite(800, 200, 'player');

        //init physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.p2.setImpactEvents(true);

        game.physics.enable(player, Phaser.Physics.P2JS);
        //game.physics.enable(ground, Phaser.Physics.P2JS);
        //ground.body.clearShapes();
        //ground.body.loadPolygon('groundPolData', 'ground');
        //game.physics.enable(ground, Phaser.Physics.P2JS); 
        player.body.gravity.y = 5;
        // player.body.clearShapes();
        // player.body.loadPolygon('physicsData', 'player');
        // ground.body.clearShapes();
        // ground.body.loadPolygon('physicsData', 'ground');

        //ground.body.immovable = true;

        //init player
        player.anchor.setTo(0.5, 0.5); 
        player.body.velocity.x = 10; 
        player.fuel = 1000;
        player.maxSpeed = 30;
        player.maxSpeedX = 30;
        player.maxSpeedY = 30;
        player.maxAngVelo = 20;
        player.minAngVelo = -20;
        player.acce = 30;
        player.lives = 3;
        player.engineLevel = 0;

        //init input
        input = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function(){
            if(player.engineLevel < 3)
                player.engineLevel++;
            console.log(player.engineLevel);
        }, this);

        game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function(){
            if(player.engineLevel > 0)
                player.engineLevel--;
            console.log(player.engineLevel);
        }, this);

        //init text
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize:'24px', fill:'#eeeeee'});
        scoreText.fixedToCamera = true;
        //timeText = game.add.text(16, 48, 'Time: 0', {fontSize:'24px', fill:'#eeeeee'});
        //timeText.fixedToCamera = true;
        fuelText = game.add.text(16, 48, 'Fuel: 0', {fontSize:'24px', fill:'#eeeeee'});
        fuelText.fixedToCamera = true;
        //altiText = game.add.text(150, 16, 'Altitude: 0', {fontSize:'24px', fill:'#eeeeee'});
        //altiText.fixedToCamera = true;
        speedXText = game.add.text(player.x + 30, player.y - 30, 'SpeedX: 0', {fontSize:'12px', fill:'#eeeeee'});
        speedYText = game.add.text(player.x + 30, player.y - 15, 'SpeedY: 0', {fontSize:'12px', fill:'#eeeeee'});

        //init particle
        emitter = game.add.emitter(player.x, player.y, 100);
        emitter.makeParticles('particle');
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.5;
        emitter.bounce.y = 0.5;
        emitter.gravity = 0;
        emitter.start(false, 200, 5, 0, false); 

        //init time
        //timer = game.time.create(false);
        //timer.loop(Phaser.Timer.SECOND, updateTime, this);
        //timer.start();


    },

    update: function () {

        // //set collision
        // if(game.physics.arcade.collide(player, ground)){
        //     //console.log("collision");
        //     //gameOver();
        // }        

        //input
        if(input.left.isDown){
            player.body.angularVelocity -= 0.1;

        }
        else if(input.right.isDown){
            player.body.angularVelocity += 0.1;            
        }
        else{            
            if(player.body.angularVelocity < -5)
                player.body.angularVelocity += 0.1;
            else if(player.body.angularVelocity > 5)
                player.body.angularVelocity -= 0.1;
            else{
                player.body.angularVelocity = 0;
                }
        }
        if(player.body.angularVelocity < player.minAngVelo)
            player.body.angularVelocity = player.minAngVelo;
        if(player.body.angularVelocity > player.maxAngVelo)
            player.body.angularVelocity = player.maxAngVelo;

        player.body.velocity.y += Math.cos(player.body.rotation) * (-0.2) * player.engineLevel;
        player.body.velocity.x += Math.sin(player.body.rotation) * (0.2) * player.engineLevel;
        player.fuel -= 0.5 * player.engineLevel;

        //update text
        scoreText.text = 'Score: ' + score;
        //timeText.text = 'Time: ' + time;
        fuelText.text = 'Fuel: ' + player.fuel;
        //altiText.text = 'Altitude: ' + parseInt(900 - player.y);
        speedXText.reset(player.x + 30, player.y - 30);
        speedXText.text = 'SpeedX: ' + parseInt(player.body.velocity.x);
        speedYText.reset(player.x + 30, player.y - 15);
        speedYText.text = 'SpeedY: ' + parseInt(player.body.velocity.y);

        //update particle
        emitter.x = player.x - Math.sin(player.body.rotation) * 24;
        emitter.y = player.y + Math.cos(player.body.rotation) * 24;
        emitter.setRotation(0, 360);
        emitter.setXSpeed(0, -player.body.velocity.x * 5);
        emitter.setYSpeed(0, -player.body.velocity.y * 5);

        //camera
        game.camera.follow(player);

        //check gameover
        if(player.fuel <= 0){
            if(player.lives > 0)
                rebirth();
            else
                game.state.start('Over');
        }
    }
};

function gameOver(){
    console.log('Game Over');
}

function updateTime() {

    time += 1;
    timeText.text = 'Time: ' + time;

}

function rebirth(){

}