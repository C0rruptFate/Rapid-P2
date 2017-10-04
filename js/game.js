//game components

var player;
var bg;
var ground;
var emitter;
var rCDTimer;
var gZeroTimer;
var deadPoint = null;

//game data
var goldNum = 0;
var lastNum = 0;
//var time = 0;

//temp var
var speed = 0
var prevSpeed = 0;

//arraies
var items;
var itemData;
var fishes;
var fishData;

//animations
var playerAlertAnime = new Array();

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

//tween
var fly

var Game = {

    preload: function () {

        //load images    
        game.load.image('bg', 'images/Art/Environment/Maps/Level_Design_Layout_full_v3.png');
        game.load.image('ground', 'images/Art/Environment/Maps/Level_Design_Layout_outline_v4.png');
        game.load.image('player', 'images/Art/Player/Sub.png'); 
        game.load.image('player2', 'images/Art/Player/Sub_A.png') 
        game.load.image('player3', 'images/Art/Player/Sub_B.png'); 
        game.load.image('particle', 'images/temp/particle.png');
        game.load.image('item', 'images/Art/Environment/Assets/ENV_GoldCoin.png');
        game.load.image('chest', 'images/Art/Environment/Assets/chestL.png');
        game.load.image('fuelCan', 'images/Art/Environment/Assets/FuelCan.png');
        game.load.image('deathMarker', 'images/Art/Environment/Assets/Tumb_1.png');
        game.load.image('lifeOn', 'images/Art/GUI/lifeOn.png');
        game.load.image('lifeOff', 'images/Art/GUI/lifeOff.png');

        //load physics
        for(var i = 0; i < 7; i++)
        {
            game.load.physics('block' + i, 'js/block' + i + '.json');
        }

        //load animation
        game.load.spritesheet('crash', 'images/Art/VFX/Explosion2.0/VFX_ExplosionSpriteSheet 85x200 - 72', 85, 200, 72);
        game.load.spritesheet('glitter', 'images/Art/VFX/GoldGlitter/VFX_GoldBrighterSpriteSheet 185x185 - 71.png', 185, 185, 71);
        game.load.spritesheet('alert1', 'images/Art/Player/Sub_warnning_sprite.png', 64, 93, 4);
        game.load.spritesheet('alert2', 'images/Art/Player/Sub_A_warnning_sprite.png', 64, 93, 4);
        game.load.spritesheet('alert3', 'images/Art/Player/Sub_B_warnning_sprite.png', 64, 93, 4);

        //load music
        game.load.audio('bgm', 'audio/background/bg_music.mp3');
        game.load.audio('bubblesMusic', 'audio/background/bg_bubbles.wav');
        game.load.audio('oceanBaseMusic', 'audio/background/bg_ocean_base.wav');
        game.load.audio('pickGold', 'audio/SFX/SFX_GoldPickUp.wav')
        game.load.audio('victory', 'audio/SFX/SFX_Victory.wav')

        //load json
        game.load.json('itemData', 'js/Treasure_coord_gold.json');
        game.load.json('fishData', 'js/fish.json');

        //load fishes
        game.load.image('fish1', 'images/Art/Environment/Assets/ENV_angler.png');
        game.load.image('fish2', 'images/Art/Environment/Assets/ENV_eel_v2.png');
        game.load.image('fish3', 'images/Art/Environment/Assets/ENV_SunFish.png');
        game.load.spritesheet('fish4', 'images/Art/VFX/FishSchool/VFX_FishSchoolSpriteSheet 813x317 - 36.png', 813, 317, 36);


    },

    create: function () {

        game.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
        bg = game.add.tileSprite(0, 0, MAP_WIDTH, MAP_HEIGHT, 'bg');

        //fishes
        fishes = game.add.group();
        fishData = game.cache.getJSON('fishData');
        for(var i = 0; i < fishData.length; i++)
        {
            var fish;
            fish = fishes.create(parseInt(fishData[i].x), parseInt(fishData[i].y), 'fish' + fishData[i].type);
            fish.alpha = 0.8;
            if(fishData[i].type == 4)
            {
                fish.scale.setTo(0.5, 0.5);
                fish.animations.add('swim');
                fish.animations.play('swim', 60, true);
            }

        }

        //set sprites         
        ground = game.add.sprite(MAP_WIDTH / 2, MAP_HEIGHT / 2, 'ground');
        player = game.add.sprite(PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y, 'alert1');

        //init physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        //game.physics.p2.defaultRestitution = 0.8;
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
        player.body.mass = 100;     
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
        player.fuel = PLAYER_DEFAULT_FUEL;
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

            var item;

            if(itemData[i].type == 1)
            {
                item = items.create(parseInt(itemData[i].x), parseInt(itemData[i].y) - 20, 'item');
                item.tween = game.add.tween(item).to({x: 1560, y: 50}, 1000, "Quart.easeOut");
                item.glitter = game.add.sprite(item.x, item.y, 'glitter');
                item.glitter.scale.setTo(0.5, 0.5);
                item.glitter.animations.add('glit');
                item.glitter.animations.play('glit', 100, true);
                item.glitter.anchor.set(0.5, 0.5);
            }
            else if(itemData[i].type == 2)
            {
                item = items.create(parseInt(itemData[i].x), parseInt(itemData[i].y) - 20, 'chest');
                item.amount = itemData[i].amount1;
                item.text = game.add.text(item.x + 25, item.y - 25, item.amount + 'M', { font:'Aquatico-Regular', fontSize:'20px', fill:'#6d5701'});                
            }
            else
            {
                item = items.create(parseInt(itemData[i].x), parseInt(itemData[i].y) - 40, 'fuelCan');
            }

            item.type = itemData[i].type;           
            
            game.physics.p2.enable(item, false);
            item.body.clearShapes();
            item.body.setCircle(32);
            item.body.data.gravityScale = 0;
            item.body.mass = 0.01;
            //item.body.static = true;
            item.body.setCollisionGroup(itemsColGroup);
            item.body.collides(playerColGroup);
            item.amount = itemData[i].amount1;               

        }



        //init texts
        texts.create();

        //set camera
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        //init animation
        for(i = 0; i < 3; i++){
            //playerAlertAnime[i] = game.add.
        }

        player.animations.add('default');
        player.animations.play('default', 5000, true);
    
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



function rebirth(){

    console.log("rebirth");

    if(player.lives == 2)
        player.loadTexture('player2', 0);
    else if(player.lives == 1)
        player.loadTexture('player3', 0);

    rebirthUI();

    player.reset(PLAYER_DEFAULT_X, PLAYER_DEFAULT_Y);
    player.fuel = PLAYER_DEFAULT_X;
    player.engineLevel = 0;

    items.forEach(function reset(item){

        item.reset(item.x, item.y);
        if(item.glitter)
            item.glitter.reset(item.x, item.y);
        if(item.text)
            item.text.reset(item.text.x, item.text.y);

    });

    speedText.alpha = 100;

}

function crash(){

    if(deadPoint == null)
    {
        deadPoint = game.add.sprite(player.x, player.y, 'deathMarker');
        game.physics.p2.enable(deadPoint, false);
        deadPoint.body.clearShapes();
        deadPoint.body.setCircle(32);
        deadPoint.body.data.gravityScale = 0;
        deadPoint.body.setCollisionGroup(deadColGroup);
        deadPoint.body.collides(playerColGroup);

        deadPoint.amount = goldNum;
    }
    else
    {
        deadPoint.reset(player.x, player.y);
        deadPoint.amount = goldNum;
    }

    game.camera.shake(0.1, 100);
    player.lives -= 1;
    player.kill();
    speedText.alpha = 0;

    rCDTimer = game.time.create(false);
    rCDTimer.loop(Phaser.Timer.SECOND * 3, function rebirthCallback() 
    {

        rCDTimer.stop();
        goldNum = 0;
    
        if(player.lives > 0)
        {
            rebirth();
        }
        else
            gameOver();
    
    }, this);

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
    crashAnime.anchor.set(0.5, 0.75);
    crashAnime.scale.setTo(2, 2);
    crashAnime.animations.add('explode');
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

    //body2.sprite.body.enable = false;

    console.log("get item");
    if(body2.sprite.type == 1)
    {
        goldNum += body2.sprite.amount;
        body2.sprite.glitter.kill();
        body2.sprite.kill();
        // body2.sprite.tween.start();
        // body2.sprite.tween.onComplete.add(function killCoin(){

        //     body2.sprite.kill();

        // }, this);
    }
    else if(body2.sprite.type == 2)
    {
        goldNum += body2.sprite.amount;
        body2.sprite.text.kill();
        body2.sprite.kill();
               
    }
    else 
    {
        player.fuel += body2.sprite.amount;
        body2.sprite.kill();
    }

    pickGoldSFX.play();         

}

function deadPointCallback(body1, body2){

    console.log("pick dead");
    goldNum += body2.sprite.amount;
    pickGoldSFX.play();
    body2.sprite.kill();

}