var input;
var player;
var bg;
var ground;
var PI = 3.1416;
var R = 180/PI;

var Game = {

    preload: function () {

        game.load.image('bg', 'images/bg.jpg');
        game.load.image('ground', 'images/ground.png');
        game.load.image('player', 'images/player.png');  

    },

    create: function () {

        //set sprites 
        bg = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        bg.anchor.setTo(0.5, 0.5);

        ground = game.add.sprite(game.world.centerX, game.world.centerY, 'ground');
        ground.anchor.setTo(0.5, 0.5);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.anchor.setTo(0.5, 0.5); 
        player.fuel = 100;
        player.maxSpeed = 50;
        player.maxAngVelo = 360;
        player.minAngVelo = -360;
        player.acce = 0;

        //set physics
        game.physics.enable(player, Phaser.Physics.ARCADE);
        game.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.immovable = true;

        //init input
        input = game.input.keyboard.createCursorKeys();

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
            // if(player.body.angularVelocity < 100)
            //     player.body.angularAcceleration = 100;
            // else if(player.body.angularVelocity > 100)
            //     player.body.angularAcceleration = -100;
            // else{
            //     player.body.angularVelocity = 0;
            //     player.body.angularAcceleration = 0;
            //     }
            player.body.angularAcceleration = 0;
            player.body.angularVelocity = 0;
        }
        if(player.body.angularVelocity < player.minAngVelo)
            player.body.angularVelocity = player.minAngVelo;
        if(player.body.angularVelocity > player.maxAngVelo)
            player.body.angularVelocity = player.maxAngVelo;


        //console.log(player.body.speed);

        if(input.up.isDown){
            player.acce = 300
        }
        else if(input.down.isDown){
            player.acce = -300;
        }

        if(player.body.speed > player.maxSpeed){
            player.acce = 0;
        }

        player.body.acceleration.x = Math.sin(player.body.rotation/R) * player.acce;
        player.body.acceleration.y = Math.cos(player.body.rotation/R) * player.acce * (-1);
        console.log(player.body.acceleration.x);
        console.log(player.body.acceleration.y);
    }
};