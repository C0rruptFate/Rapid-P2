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

        game.load.image('bg', 'images/Art/Environment/sky_background.png');
        game.load.image('ground', 'images/Art/Environment/ground.png');
        game.load.image('player', 'images/Art/Player/player.png');  
        game.load.image('particle', 'images/particle.png');

    },

    create: function () {

        //set sprites 
        bg = game.add.tileSprite(0, 0, 3200, 1800, 'bg');
        //bg.anchor.setTo(0.5, 0.5);

        ground = game.add.sprite(game.world.centerX, game.world.centerY, 'ground');
        ground.anchor.setTo(0.5, 0.5);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.anchor.setTo(0.5, 0.5); 
        player.fuel = 900;
        player.maxSpeed = 30;
        player.maxSpeedX = 30;
        player.maxSpeedY = 30;
        player.maxAngVelo = 720;
        player.minAngVelo = -720;
        player.acce = 30;

        //set physics
        // game.physics.startSystem(Phaser.Physics.P2JS);
        // game.physics.p2.setImpactEvents(true);

        // var playerCollisionGroup = game.physics.p2.createCollisionGroup();
        // var groundCollisionGroup = game.physics.p2.createCollisionGroup();

        // game.physics.p2.updateBoundsCollisionGroup();
        // ground.physicsBodyType = Phaser.Physics.P2JS;

        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.physics.enable(ground, Phaser.Physics.ARCADE);


        ground.body.immovable = true;

        //init input
        input = game.input.keyboard.createCursorKeys();

        //init text
        scoreText = game.add.text(16, 16, 'Score: 0', {fontSize:'24px', fill:'#eeeeee'});
        timeText = game.add.text(16, 48, 'Time: 0', {fontSize:'24px', fill:'#eeeeee'});
        fuelText = game.add.text(16, 80, 'Fuel: 0', {fontSize:'24px', fill:'#eeeeee'});
        altiText = game.add.text(150, 16, 'Altitude: 0', {fontSize:'24px', fill:'#eeeeee'});
        speedXText = game.add.text(150, 48, 'Horizontal Speed: 0', {fontSize:'24px', fill:'#eeeeee'});
        speedYText = game.add.text(150, 80, 'Vertical Speed: 0', {fontSize:'24px', fill:'#eeeeee'});

        //init particle
        emitter = game.add.emitter(player.x, player.y, 100);
        emitter.makeParticles('particle');
        emitter.minParticleScale = 0.8;
        emitter.maxParticleScale = 1.2;
        emitter.bounce.y = 0.5;
        emitter.gravity = 0;
        emitter.start(false, 200, 5, 0, false);
     

    },

    update: function () {

        //set collision
        if(game.physics.arcade.collide(player, ground)){
            //console.log("collision");
            //gameOver();
        }
        

        //input
        if(input.left.isDown){
            player.body.angularAcceleration = -360;
            
        }
        else if(input.right.isDown){
            player.body.angularAcceleration = 360;            
        }
        else{            
            if(player.body.angularVelocity < -50)
                player.body.angularAcceleration = 360;
            else if(player.body.angularVelocity > 50)
                player.body.angularAcceleration = -360;
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
            player.fuel -= 1;
            player.body.acceleration.y = Math.cos(player.body.rotation/R) * (-15);
            player.body.acceleration.x = Math.sin(player.body.rotation/R) * (15);

        }
        // else if(input.down.isDown){
        //     //player.acce = -30;
        //     //player.body.velocity.x = Math.sin(player.body.rotation/R) * player.acce;
        //     player.body.acceleration.y = Math.cos(player.body.rotation/R) * 15;
        //     player.body.acceleration.x = Math.sin(player.body.rotation/R) * (-15);
        // }
        else{
            player.body.acceleration.x = 0;
            player.body.acceleration.y = 0;
        }

        //detect borders
        player.body.collideWorldBounds = true;
        // if(player.x < 0 || player.x > 1600){
        //     player.x -= player.body.velocity.x;
        // }
        // if(player.y < 0 || player.y > 900){
        //     player.y -= player.body.velocity.y;
        // }

        //update text
        scoreText.text = 'Score: ' + score;
        timeText.text = 'Time: ' + time;
        fuelText.text = 'Fuel: ' + player.fuel;
        altiText.text = 'Altitude: ' + parseInt(900 - player.y);
        speedXText.text = 'Horizontal Speed: ' + parseInt(player.body.velocity.x);
        speedYText.text = 'Vertical Speed: ' + parseInt(player.body.velocity.y);

        //update particle
        emitter.x = player.x - Math.sin(player.body.rotation/R) * 24;
        emitter.y = player.y + Math.cos(player.body.rotation/R) * 24;
        emitter.setRotation(0, 360);
        emitter.setXSpeed(0, -player.body.acceleration.x*20);
        emitter.setYSpeed(0, -player.body.acceleration.y*20);

        //camera
        game.camera.follow(player);
    }
};

function gameOver(){
    console.log('Game Over');
}