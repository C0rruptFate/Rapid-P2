var input;
var player;
var bg;
var ground;
var PI = 3.1416;
var R = 180/PI;

var scoreText;
var timeText;
var fuelText;
var altiText;
var speedXText;
var speedYText;

var score = 0;
var time = 0;

var emitter;

var Game = {

    preload: function () {

        game.load.image('bg', 'images/bg.jpg');
        game.load.image('ground', 'images/ground.png');
        game.load.image('player', 'images/player.png');  
        game.load.image('particle', 'images/particle.png');

    },

    create: function () {

        //set sprites 
        bg = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        bg.anchor.setTo(0.5, 0.5);

        ground = game.add.sprite(game.world.centerX, 857, 'ground');
        ground.anchor.setTo(0.5, 0.5);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.anchor.setTo(0.5, 0.5); 
        player.fuel = 100;
        player.maxSpeed = 30;
        player.maxAngVelo = 720;
        player.minAngVelo = -720;
        player.acce = 30;

        //set physics
        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.immovable = true;

        //init input
        input = game.input.keyboard.createCursorKeys();

        //init text
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize:'24px', fill:'#dddddd'});
        timeText = game.add.text(16, 48, 'Time: 0', {fontSize:'24px', fill:'#dddddd'});
        fuelText = game.add.text(16, 80, 'Fuel: 0', {fontSize:'24px', fill:'#dddddd'});
        altiText = game.add.text(150, 16, 'Altitude: 0', {fontSize:'24px', fill:'#dddddd'});
        speedXText = game.add.text(150, 48, 'Horizontal Speed: 0', {fontSize:'24px', fill:'#dddddd'});
        speedYText = game.add.text(150, 80, 'Vertical Speed: 0', {fontSize:'24px', fill:'#dddddd'});

        //init particle
        emitter = game.add.emitter(player.x, player.y, 50);
        emitter.makeParticles('particle');
        emitter.start(false, 1000, 5);
        emitter.bounce.y = 0.5;
        emitter.gravity = 0;
        

    },

    update: function () {

        //set collision
        game.physics.arcade.collide(player, ground);

        //input
        if(input.left.isDown){
            player.body.angularAcceleration = -360;
            
        }
        else if(input.right.isDown){
            player.body.angularAcceleration = 360;            
        }
        else{            
            if(player.body.angularVelocity < -100)
                player.body.angularAcceleration = 200;
            else if(player.body.angularVelocity > 100)
                player.body.angularAcceleration = -200;
            else{
                player.body.angularVelocity = 0;
                player.body.angularAcceleration = 0;
                }
        }
        if(player.body.angularVelocity < player.minAngVelo)
            player.body.angularVelocity = player.minAngVelo;
        if(player.body.angularVelocity > player.maxAngVelo)
            player.body.angularVelocity = player.maxAngVelo;



        if(input.up.isDown){
            player.acce = 30
            player.body.velocity.x = Math.sin(player.body.rotation/R) * player.acce;
            player.body.velocity.y = Math.cos(player.body.rotation/R) * player.acce * (-1);
        }
        else if(input.down.isDown){
            player.acce = -30;
            player.body.velocity.x = Math.sin(player.body.rotation/R) * player.acce;
            player.body.velocity.y = Math.cos(player.body.rotation/R) * player.acce * (-1);
        }


        //player.body.acceleration.x = Math.sin(player.body.rotation/R) * player.acce;
        //player.body.acceleration.y = Math.cos(player.body.rotation/R) * player.acce * (-1);
        //console.log(player.body.acceleration.x);
        //console.log(player.body.acceleration.y);

        //update text
        scoreText.text = 'Score: ' + score;
        timeText.text = 'Time: ' + time;
        fuelText.text = 'Fuel: ' + player.fuel;
        altiText.text = 'Altitude: ' + parseInt(783 - player.y);
        speedXText.text = 'Horizontal Speed: ' + parseInt(player.body.velocity.x);
        speedYText.text = 'Vertical Speed: ' + parseInt(player.body.velocity.y);

        //update particle
        emitter.x = player.x - Math.sin(player.body.rotation/R) * 24;
        emitter.y = player.y + Math.cos(player.body.rotation/R) * 24;
        emitter.setRotation(0, 360);
        emitter.setXSpeed(0, -player.body.velocity.x);
        emitter.setYSpeed(0, -player.body.velocity.y);
    }
};