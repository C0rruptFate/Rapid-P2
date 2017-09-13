var input;
var player;
var bg;
var ground;

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
            player.body.angularVelocity = 30;
        }
        else if(input.right.isDown){
            player.body.angularVelocity = -30;
        }

        if(input.up.isDown){
            player.body.velocity.x = 30
        }
        else if(input.down.isDown){
            player.body.velocity.x = -30;
        }
    }
};