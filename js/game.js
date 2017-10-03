//game components

var player;
var bg;
var ground;
var emitter;
var rCDTimer;
var gZeroTimer;
var deadPoint = null;

//game data
var goldNum = 300;
var lastNum = 0;
//var time = 0;

//temp var
var speed = 0
var prevSpeed = 0;

//arraies
var items;
var itemData;

//animations
//var crashAnime;

//music 
var bgm;
var bubblesMusic;
var oceanBaseMusic;
var pickGoldSFX;
var victorySFX;

//collision groups
var playerColGroup
var groundColGroup
var itemsColGroup
var deadColGroup

var Game = {

    preload: function () {

        //load images    
        game.load.image('bg', 'images/Art/Environment/Maps/Level_Design_Layout_full_v2.png');
        game.load.image('ground', 'images/Art/Environment/Maps/Level_Design_Layout_outline_v2_2.png');
        game.load.image('player', 'images/Art/Player/Sub.png'); 
        game.load.image('player2', 'images/Art/Player/Sub_A.png') 
        game.load.image('player3', 'images/Art/Player/Sub_B.png'); 
        game.load.image('particle', 'images/temp/particle.png');
        game.load.image('item', 'images/Art/Environment/Assets/ENV_GoldCoin.png');
        game.load.image('chest', 'images/Art/Environment/Assets/ENV_GoldChest.png');
        game.load.image('deathMarker', 'images/Art/Environment/Assets/Tumb_1.png');


        //load physics
        for(var i = 0; i < 7; i++)
        {
            game.load.physics('block' + i, 'js/block' + i + '.json');
        }

        //load animation
        game.load.spritesheet('crash', 'images/Art/VFX/Explosion2.0/VFX_ExplosionSpriteSheet 85x200 - 72', 85, 200, 72);

        //load music
        game.load.audio('bgm', 'audio/background/bg_music.mp3');
        game.load.audio('bubblesMusic', 'audio/background/bg_bubbles.wav');
        game.load.audio('oceanBaseMusic', 'audio/background/bg_ocean_base.wav');
        game.load.audio('pickGold', 'audio/SFX/SFX_GoldPickUp.wav')
        game.load.audio('victory', 'audio/SFX/SFX_Victory.wav')

        //load json
        game.load.json('itemData', 'js/Treasure_coord_gold.json');

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
        playerColGroup = game.physics.p2.createCollisionGroup();
        groundColGroup = game.physics.p2.createCollisionGroup();
        itemsColGroup = game.physics.p2.createCollisionGroup();
        deadColGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        game.physics.p2.enable(player, false);
        // player.body.kinematic = true;
        // player.body.data.shapes[0] = false;
        player.body.clearShapes();
        player.body.setCircle(32);        
        player.body.setCollisionGroup(playerColGroup);        
        player.body.collideWorldBounds = true;
        //player.body.gravity.y = 10;

        game.physics.p2.enable(ground, false);
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
        player.body.collides(deadColGroup, deadPointCallback, this);
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
        emitter = game.add.emitter(player.x - Math.sin(player.body.rotation) * 30, player.y + Math.cos(player.body.rotation) * 30, 100);
        emitter.makeParticles('particle');
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.5;
        emitter.bounce.y = 0.5;
        emitter.gravity = 0;
        emitter.start(false, 200, 5, 0, false); 

        //init arraies
        itemData = game.cache.getJSON('itemData');

        items = game.add.group();
        for(var i = 0; i < itemData.length; i++){

            var item = items.create(parseInt(itemData[i].x), parseInt(itemData[i].y) - 20, 'item');
            game.physics.p2.enable(item, false);
            item.body.clearShapes();
            item.body.setCircle(32);
            item.body.data.gravityScale = 0;
            //item.body.data.shapes[0].sensor = true;
            item.body.setCollisionGroup(itemsColGroup);
            item.body.collides(playerColGroup);
            item.amount = itemData[i].amount1;

            item.text = game.add.text(item.x + 25, item.y - 25, item.amount + 'M', { font:'Aquatico-Regular', fontSize:'20px', fill:'#6d5701'});

        }

        //init texts
        texts.create();

        //set camera
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //init animation
    
        //init music
        bgm = game.add.audio('bgm');
        bgm.allowMultiple = true;
        bgm.play();

        bubblesMusic = game.add.audio('bubblesMusic');
        bubblesMusic.allowMultiple = true;
        bubblesMusic.play();

        oceanBaseMusic = game.add.audio('oceanBaseMusic');
        oceanBaseMusic.allowMultiple = true;
        oceanBaseMusic.play();

        pickGoldSFX = game.add.audio('pickGold');
        pickGoldSFX.allowMultiple = true;

        //dead point



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

        prevSpeed = speed;
        speed = Math.sqrt(Math.pow(player.body.velocity.x, 2) + Math.pow(player.body.velocity.y, 2));        

        //update text        
        texts.update();

        //update particle
        if(player.engineLevel == 0)
            emitter.on = false;
        else
            emitter.on = true;

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

        //Animation
        

    }
        
};

function gameOver(){
    console.log('Game Over');
    game.state.start('Over');
}

function rebirthCallback() {

    rCDTimer.stop();
    goldNum = 0;

    if(player.lives > 0)
    {
        rebirth();
    }
    else
        gameOver();

}

function rebirth(){

    console.log("rebirth");

    if(player.lives == 2)
        player.loadTexture('player2', 0);
    else if(player.lives == 1)
        player.loadTexture('player3', 0);

    player.reset(800, 800);
    player.fuel = 3000;
    player.engineLevel = 0;

    items.forEach(function reset(item){

        item.reset(item.x, item.y);

    });

    speedText.alpha = 100;

}

function crash(){

    if(deadPoint == null){
        deadPoint = game.add.sprite(player.x, player.y, 'deathMarker');
        game.physics.p2.enable(deadPoint, false);
        deadPoint.body.clearShapes();
        deadPoint.body.setCircle(32);
        deadPoint.body.data.gravityScale = 0;
        deadPoint.body.setCollisionGroup(deadColGroup);
        deadPoint.body.collides(playerColGroup);

        deadPoint.amount = goldNum;
    }
    else{

        deadPoint.reset(player.x, player.y);
        deadPoint.amount = goldNum;

    }

    game.camera.shake(0.1, 100);
    player.lives -= 1;
    player.kill();
    speedText.alpha = 0;

    rCDTimer = game.time.create(false);
    rCDTimer.loop(Phaser.Timer.SECOND * 3, rebirthCallback, this);
    rCDTimer.start();

    gZeroTimer = game.time.create(false);
    gZeroTimer.loop(1, function goldToZero()
        {
            if(goldNum >= 11)
                goldNum -= 11;
            else{
                goldNum = 0;
                gZeroTimer.stop();
            }          

        }, this);
    gZeroTimer.start();

    var crashAnime = game.add.sprite(player.x, player.y, 'crash');
    crashAnime.anchor.set(0.5, 0.5);
    var explosion = crashAnime.animations.add('explode');
    crashAnime.animations.play('explode', 60, false);

}

function colCallback(){

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.engineLevel = 0;

    if(prevSpeed > CRASH_SPEED)
        crash();

}

function itemsCallback(body1, body2){

    console.log("get item");
    goldNum += body2.sprite.amount;
    pickGoldSFX.play();
    body2.sprite.text.kill();
    body2.sprite.kill();
    

}

function deadPointCallback(body1, body2){

    console.log("pick dead");
    goldNum += body2.sprite.amount;
    pickGoldSFX.play();
    body2.sprite.kill();

}