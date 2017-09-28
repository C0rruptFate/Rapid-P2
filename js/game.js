//game components

var player;
var bg;
var ground;
var emitter;
var timer;

//game data
var goldNum = 0;
var time = 0;

//temp var
var speed

//arraies
var items;

var Game = {

    preload: function () {

        game.load.image('bg', 'images/Art/Environment/Level_Design_Layout_v4.png');
        game.load.image('ground', 'images/Art/Environment/Level_Design_Layout_v4_outline.png');
        game.load.image('player', 'images/Art/Player/PLA_Default.png'); 
        game.load.image('player2', 'images/Art/Player/player.png') 
        game.load.image('particle', 'images/temp/particle.png');
        game.load.image('item', 'images/temp/coin.png');
        game.load.image('chestS', 'images/temp/chestS.png');
        game.load.image('chestL', 'images/temp/chestL.png');

        for(var i = 0; i < 7; i++)
        {
            game.load.physics('block' + i, 'js/block' + i + '.json');
        }

    },

    create: function () {

        game.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        //set sprites 
        bg = game.add.tileSprite(0, 0, MAP_WIDTH, MAP_HEIGHT, 'bg');
        ground = game.add.sprite(MAP_WIDTH / 2, MAP_HEIGHT / 2, 'ground');
        player = game.add.sprite(800, 800, 'player');

        //init physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.defaultRestitution = 0.8;
        game.physics.p2.gravity.y = 10;
        var playerColGroup = game.physics.p2.createCollisionGroup();
        var groundColGroup = game.physics.p2.createCollisionGroup();
        var itemsColGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        game.physics.p2.enable(player, true);
        // player.body.kinematic = true;
        // player.body.data.shapes[0] = false;
        player.body.clearShapes();
        player.body.setCircle(32);        
        player.body.setCollisionGroup(playerColGroup);        
        player.body.collideWorldBounds = true;

        game.physics.p2.enable(ground, true);
        // ground.body.kinematic = true;
        ground.body.static = true;
        ground.body.clearShapes();

        for(var i = 0; i < 7; i++)
        {
            ground.body.loadPolygon('block' + i, 'block' + i);   
        }
             
        ground.body.setCollisionGroup(groundColGroup);

        player.body.collides(groundColGroup, colCallback, this);
        player.body.collides(itemsColGroup, itemsCallback, this);
        ground.body.collides(playerColGroup);        

        //init player
        player.anchor.setTo(0.5, 0.5); 
        player.fuel = 3000;
        player.maxSpeed = 30;
        player.maxSpeedX = 30;
        player.maxSpeedY = 30;
        player.maxAngVelo = 20;
        player.minAngVelo = -20;
        player.acce = 30;
        player.lives = 3;
        player.engineLevel = 0;
        player.isMoving = false;

        //init input
        inputManager.create();    

        //init particle
        emitter = game.add.emitter(player.x, player.y, 100);
        emitter.makeParticles('particle');
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.5;
        emitter.bounce.y = 0.5;
        emitter.gravity = 0;
        emitter.start(false, 200, 5, 0, false); 

        //init time
        timer = game.time.create(false);
        timer.loop(Phaser.Timer.SECOND, updateTime, this);
        timer.start();

        //init arraies
        items = game.add.group();
        for(var i = 0; i < 1; i++){
            
            var item = items.create(800, 1000, 'item');
            game.physics.p2.enable(item, true);
            item.body.clearShapes();
            item.body.setCircle(32);
            //item.body.data.shapes[0].sensor = true;
            item.body.setCollisionGroup(itemsColGroup);
            item.body.collides(playerColGroup);

        }

        //init texts
        texts.create();

        //set camera
        game.camera.follow(player);

    },

    update: function () {
    

        //update velocity
        if(!input.left.isDown && !input.right.isDown)
        {            
            
            if(player.body.angularVelocity < -5)
                player.body.angularVelocity += 0.1;
            else if(player.body.angularVelocity > 5)
                player.body.angularVelocity -= 0.1;
            else
                player.body.angularVelocity = 0;
                
        }

        if(player.body.angularVelocity < player.minAngVelo)
            player.body.angularVelocity = player.minAngVelo;
        if(player.body.angularVelocity > player.maxAngVelo)
            player.body.angularVelocity = player.maxAngVelo;

        player.body.velocity.y += Math.cos(player.body.rotation) * (-0.2) * player.engineLevel;
        player.body.velocity.x += Math.sin(player.body.rotation) * (0.2) * player.engineLevel;
        player.fuel -= 0.5 * player.engineLevel;

        //update text        
        texts.update();

        //update particle
        emitter.x = player.x - Math.sin(player.body.rotation) * 24;
        emitter.y = player.y + Math.cos(player.body.rotation) * 24;
        emitter.setRotation(0, 360);
        emitter.setXSpeed(0, - Math.sin(player.body.rotation) * 100 * player.engineLevel);
        emitter.setYSpeed(0, Math.cos(player.body.rotation) * 100 * player.engineLevel);

        //check gameover
        if(player.fuel <= 0){

            if(player.lives > 0)
                rebirth();
            else
                gameOver();
        
        }

    }
        
};

function gameOver(){
    console.log('Game Over');
    game.state.start('Over');
}

function updateTime() {

    time += 1;

}

function rebirth(){

    console.log("rebirth");
    //game.state.start('Game');
    //player = game.add.sprite(800, 800, 'player');
    player.reset(800, 800);
    player.fuel = 3000;
    player.engineLevel = 0;
    //player.revive();

}

function crash(){

    var startTime = time;
    player.lives -= 1;
    if(player.lives > 0)
    {
        var startTime = time;
        rebirth();
    }
    else
        gameOver();

}

function colCallback(){

    console.log("collision");
    speed = Math.sqrt(Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2));
    console.log(speed);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.engineLevel = 0;
    if(speed > 100)
        crash();

}

function itemsCallback(body1, body2){

    console.log("get item");
    body2.sprite.kill();
    goldNum += 10;

}