
LittleStar.Game = function (game)
{
  /* members */
  this.showBounds=false;
  this.activePhysicsSystem = LittleStar.PHYSICS_NONE;

  // custom bottom bounds
  this.lowerWorldBoundY;
  this.lowerWorldLine;
  this.customBottomBoundArcade;
  this.customBottomBoundP2;

  // groups
  this.bgGroup;
  this.characterGroup;
  this.environmentGroup;
  this.debugGroup;
  this.crateGroup;
  this.planetGroup;
  this.enemyGroup;

  this.alien;

  this.buttons;

  // a force reducer to let the simulation run smoothly

  this.forceReducer = 0.005;

  this.music;
  this.sfx;

  // score text
 this.LifeText;
 this.crateSprite;

};
var zooming = false;
var zoomAmount = 0;
var cursors;
var size = new Phaser.Rectangle();

LittleStar.Game.prototype =
{
    preload: function ()
    {
        this.physics.startSystem(Phaser.Physics.P2JS);
    },
    create: function ()
    {

        // audio
        // music (volume 1.0, loop: true)
        this.music = this.add.audio('music', 1.0, true);
        this.music.play();
        // sfx
        this.sfx =
        {
          ping: this.add.audio('ping'),
          sword: this.add.audio('sword'),
          eatenemy: this.add.audio('eatenemy'),
          jumpsound: this.add.audio('jumpsound'),
          intro: this.add.audio('intro'),
          dead: this.add.audio('dead'),
          winner: this.add.audio('winner'),
          bigjump: this.add.audio('bigjump'),
        };

        this.points = 0;
        this.lastPoints = -1;

        this.life = 25;
        // life text (fixed to camera)
        let lifePos = {x: 32, y:  32};
        this.LifeText = this.add.text(lifePos.x, lifePos.y, "Lives: " + this.life, { font: "32px Arial", fill: "#FFFFFF", align: "left" });
        this.LifeText.fixedToCamera = true;
        this.LifeText.visible = false;

        this.onGround = false;
        this.player;
        this.playerForceLeftRight = 0;
        this.playerSpeed = 10;
        this.playerSize = 2;
        this.playerBiggerThanEnemy = 3;

        this.enemies = 16;
        this.jumpForce = 0;

        this.playerTweens = [];

        this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH / 2), -(LittleStar.SCREEN_HEIGHT / 2), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
        //this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH), -(LittleStar.SCREEN_HEIGHT), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
        //this.game.world.setBounds(0, 0, (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
        // adding groups

    		this.crateGroup = this.game.add.group();
    		this.planetGroup = this.game.add.group();
        this.bullets = this.game.add.group();
        this.enemyGroup = this.game.add.group();


        this.debugGroups = [this.crateGroup, this.planetGroup, this.bullets, this.enemyGroup];

    		// adding graphic objects

    		gravityGraphics = this.add.graphics(0, 0);
      	gravityGraphics.lineStyle(2,0xffffff,0.5);

    		// stage setup

    		this.stage.backgroundColor = "#222222";

        // physics setup
        //this.game.physics.p2.restitution = 0.9;


        //this.game.physics.p2.enable(ship);
        //ship.body.static = true;
    		// adding a couple of planets. Arguments are:
    		// x position
    		// y position
    		// gravity radius
    		// gravity force
    		// graphic asset
        this.addPlanet(0, 0, 400, 250, "erde");

    		// waiting for player input
    		//this.input.onDown.add(this.addCrate, this);
        this.cursors = this.input.keyboard.createCursorKeys();

            // buttons
        this.buttons = this.input.keyboard.addKeys(
            {
              zoom: Phaser.KeyCode.Z,
              jump: Phaser.KeyCode.SPACEBAR,
              addpoints: Phaser.KeyCode.P,
              die: Phaser.KeyCode.D,
            }
          );
        this.buttons.zoom.onDown.add(this.startZoom, this);
        this.buttons.zoom.onUp.add(this.stopZoom, this);
        size.setTo(-960, -600, 1920, 1200);

        // add player
        this.addCrate(0);
        //this.player.y;
        //this.player.x;
        // camera: set to follow player (follow styles: https://phaser.io/examples/v2/camera/follow-styles)
        this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);


        this.game.camera.scale.x = 24;
        this.game.camera.scale.y = 24;

        //this.game.camera.scale.x = 40;
        //this.game.camera.scale.y = 40;

        //this.player.body.collides(this.planetGroup, this.setOnGround, this);

        this.player.body.onBeginContact.add(this.blockHit, this);



  },

  blockHit: function(body, bodyB, shapeA, shapeB, equation) {

      //  The block hit something.
      //
      //  This callback is sent 5 arguments:
      //
      //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
      //  The p2.Body this Body is in contact with.
      //  The Shape from this body that caused the contact.
      //  The Shape from the contact body.
      //  The Contact Equation data array.
      //
      //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
      if (body)
      {

          if(this.points >= 75)
          {
              if(body.sprite.key == "erde")
              {
                  crateSprite.loadTexture("player"+15, 0);
                  body.sprite.kill();
                  this.player.width = 220;
                  this.player.height = 220;

                  this.player.body.setCircle(this.player.width / 2);
              }

          }

          for (var i = 0; i < this.enemies; i++) {
            if (body.sprite.key == "enemy" + i) {
              if (this.points >= (i * 5)) {
                this.addPoints();

                body.sprite.kill();
                this.sfx.eatenemy.play();
                crateSprite.loadTexture("player"+i, 0);
              } else {

                // check for ongoing player tweens
                var loseLife = true;
                for (var i = 0; i < this.playerTweens.length; i++)
                {
                  // player immunity for tween period
                  //console.log("Immunity!");
                  if (this.playerTweens[i].isRunning) loseLife = false;
                }

                if (loseLife)
                {
                  this.life --;
                  this.sfx.dead.play();
                }
                // if(this.life == 0)
                //   this.state.start('Bam');

                // hittween
                if (this.life != 0)
                {
                  // create new tween {properties}, duration, easing function, autostart, delay, repeat_number, yoyo
                  var alphaTween = this.game.add.tween(this.player).to( { alpha: 0.2}, 100, Phaser.Easing.Linear.None, true, 0, 10, true);
                  this.playerTweens.push(alphaTween); // keep reference for destroying
                  // tween removal after completion
                  alphaTween.onComplete.add(
                  () =>
                  {
                    for (let i=0;i<this.playerTweens.length;i++)
                      {
                        if (this.playerTweens[i] == alphaTween)
                        {
                          //console.log("removing Tween" + i);
                          this.playerTweens.splice(i, 1);
                        }
                      }
                     this.player.alpha = 1;
                    this.game.tweens.remove(alphaTween);
                  }, this);
                }

              }
            }
          }

          console.log(this.points);
          if(body.sprite.key == "erde")
              this.onGround = true;


          this.LifeText.text = "Lives: " + this.life;
          this.debug = 'lives: ' + this.life + ", points: " + this.points;
      }
      else
      {
          //this.debug  = 'You last hit: The wall :)';
      }

      this.buttons.addpoints.onDown.add(this.addPoints, this);
      this.buttons.die.onDown.add(()=>{ this.life = 0; }, this);

  },
  update: function()
  {

    if(this.life <= 0)
    {
        this.game.sound.stopAll();
        this.state.start('Bam');
    }

    deltaTime = this.game.time.elapsed/1000;
    this.timerCurrent += deltaTime;

    if(this.jumpForce > 0)
    {
        this.jumpForce -= deltaTime * 100;
        if(this.jumpForce < 0)
            this.jumpForce = 0;
    }


     //this.player.body.setZeroVelocity();
    if (this.cursors.up.isDown)
    {
        this.game.world.rotation -= 0.05;
    }
    else if (this.cursors.down.isDown)
    {
        this.game.world.rotation += 0.05;
    }
    if (this.cursors.left.isDown)
    {
        this.playerForceLeftRight = -this.playerSpeed;
    }
    else if (this.cursors.right.isDown)
    {
        this.playerForceLeftRight = this.playerSpeed;
    }
    if (this.buttons.jump.isDown && (this.onGround))
    {
        console.log("jump");
        this.sfx.jumpsound.play();
        //this.player.body.velocity.y = -40;
        this.onGround = false;
        this.jumpForce = 86 + (this.points / 5);

        this.planetGroup.forEachAlive(
          (member) =>
          {
            var angle = Math.atan2(member.y - this.player.y, member.x - this.player.x);
            //obj1.body.rotation = angle + this.game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
             //this.player.body.force.x = Math.cos(angle) * 100;    // accelerateToObject
             //this.player.body.force.y = Math.sin(angle) * 100;

             /*var mass = .1;
             var time = 1;
            let impulse = [	(mass * this.player.body.velocity.x) * time,
              ((mass * 2) * time) // using a static velocity of 2 for a "punch" multiply buy the time the user stays pressing the key
            ];

            this.player.body.applyImpulse(impulse,this.player.x,this.player.y);*/

          }, this)
    }


    this.crateGroup.forEachAlive(this.moveBullets,this);  //make bullets accelerate to ship

    /*if (zooming)
        {
            this.game.camera.scale.x += zoomAmount;
            this.game.camera.scale.y += zoomAmount;

            this.game.camera.bounds.x = size.x * this.game.camera.scale.x;
            this.game.camera.bounds.y = size.y * this.game.camera.scale.y;
            this.game.camera.bounds.width = size.width * this.game.camera.scale.x;
            this.game.camera.bounds.height = size.height * this.game.camera.scale.y;
        }*/

    //this.crateGroup.forEachAlive(this.moveEnemy,this, 80);
    this.enemyGroup.forEachAlive(this.moveEnemy,this, 80);
    this.movePlayer(this.player, 80);


    this.playerForceLeftRight = 0;
    this.game.world.rotation = -this.player.body.rotation - this.game.math.degToRad(180);


    for (var i = 0; i < this.enemies; i++) {
        if(this.lastPoints != this.points)
        {
          if (this.points == i*5) {
            this.game.camera.scale.x = 18 - (17 * i / (this.enemies - 1));
            this.game.camera.scale.y = 18 - (17 * i / (this.enemies - 1));
            this.player.width = (this.points/5) * this.playerSize + this.playerBiggerThanEnemy;
            this.player.height = (this.points/5) * this.playerSize + this.playerBiggerThanEnemy;


            if(this.points == 70)
            {
                this.player.width = 80;
                this.player.height = 80;
            }
            else if(this.points == 75)
            {
                this.player.width = 120;
                this.player.height = 120;
            }


            this.player.body.setCircle(this.player.width / 2);

            console.log(this.game.camera.scale.x + " x " + this.game.camera.scale.y);
            this.LifeText.scale.setTo(20 / this.game.camera.scale.x - 1, 20 / this.game.camera.scale.y - 1);
            this.LifeText.position.x = 32;
            this.LifeText.position.y = 32;

            this.LifeText.rotation = -this.game.world.rotation;

            this.spawneEnemies();
            this.lastPoints = this.points;

          }
      }
    }


    this.game.world.rotation = -this.player.body.rotation;
  },
  setOnGround: function() {
      this.onGround = true;
  },

  moveEnemy: function(bullet, forceLeftRight, speed) {
       this.accelerateToObject(bullet, 0, speed, false);  //start accelerateToObject on every bullet
  },

  movePlayer: function(bullet, forceLeftRight, speed) {
       this.accelerateToObject(bullet, this.playerForceLeftRight, speed, true);  //start accelerateToObject on every bullet
  },

  accelerateToObject: function(obj1, forceLeftRight, speed, player) {
      if (typeof speed === 'undefined') { speed = 30; }
      var forceLRcos = 0;
      var forceLRsin = 0;
        this.planetGroup.forEachAlive(
          (member) =>
          {
            var angle = Math.atan2(member.y - obj1.y, member.x - obj1.x);
            obj1.body.rotation = angle - this.game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)

            for(var i = 12; i < this.enemies; i++)
                if(obj1.body.sprite.key == "enemy" + i)
                {
                    forceLeftRight = 10;
                    forceLRcos = Math.cos(obj1.body.rotation) * forceLeftRight;
                    forceLRsin = Math.sin(obj1.body.rotation) * forceLeftRight;
                }

            if(player)
            {
                speed =  (speed - this.jumpForce);
                forceLRcos = Math.cos(obj1.body.rotation) * (forceLeftRight * (this.points / 25 + 1));
                forceLRsin = Math.sin(obj1.body.rotation) * (forceLeftRight * (this.points / 25 + 1));
            }
            obj1.body.force.x = Math.cos(angle) * speed + forceLRcos;    // accelerateToObject
            obj1.body.force.y = Math.sin(angle) * speed + forceLRsin;
          }, this)

  },
  render: function()
  {

        // for now always show debug text
        this.game.debug.text(this.debug, 32, 32);

        if (!LittleStar.DEBUG) return;

        this.player.body.debug = true;

        // Debug: highlights all members of all groups
        for (let i = 0; i < this.debugGroups.length; i++)
        {
          this.debugGroups[i].forEachAlive(
            (member) =>
            {
              //this.game.debug.spriteBounds(member);
              //this.game.debug.body(member);

              member.body.debug = true;

            }, this);
    }


    //this.game.debug.text(this.debug, 32, LittleStar.SCREEN_HEIGHT*0.95);
},
spawneEnemies: function(){

    this.enemyGroup.forEachAlive(
    (member) =>
    {
      member.kill();
    }, this);

        for (var type = this.points/5; type <= this.points/5+1; type++) {
            for (var i = 0; i < 15 - type; i++) {
                this.addEnemy(i+ type/5, type);
            }
        }

},
// function to add a crate
addCrate: function(e){

	crateSprite = this.game.add.sprite(0, -150, "player");

  crateSprite.width = (this.points/5) * this.playerSize + this.playerBiggerThanEnemy;
  crateSprite.height = (this.points/5) * this.playerSize + this.playerBiggerThanEnemy;

    //var crateSprite = this.game.add.sprite(x, y, "crate");
	//this.crateGroup.add(crateSprite);
	this.game.physics.p2.enable(crateSprite);
  this.player = crateSprite;

},

// function to add a crate
addEnemy: function(angle, enemyType){

  var radius = 150;

  var x = radius * Math.sin(angle); //this.game.world.rotation + 45);
  var y = radius * Math.cos(angle); //this.game.world.rotation + 45);

  var texture = "enemy" + enemyType;


   var enemy = this.game.add.sprite(x, y, texture);

  var w = enemy.width;
  var h = enemy.height;

  enemy.height = enemyType * (this.playerSize *.97) + 1;

  if(enemyType == this.enemies - 1)
      enemy.height = 35 * (this.playerSize *.97) + 1;

  enemy.width = enemy.height * (w / h);

  //var crateSprite = this.game.add.sprite(x, y, "crate");
  //this.crateGroup.add(enemy);
  this.enemyGroup.add(enemy);
  this.game.physics.p2.enable(enemy);
  //enemy.body.fixedRotation = true; // disable collisions rotating character

},

// function to add a planet

addPlanet: function(posX, posY, gravityRadius, gravityForce, asset){
	var planet = this.game.add.sprite(posX, posY, asset);


  planet.width = 250;
  planet.height = 250;

	planet.gravityRadius = gravityRadius;
	planet.gravityForce = gravityForce
	this.planetGroup.add(planet);
	this.game.physics.p2.enable(planet);
	planet.body.static = true;

	// look how I create a circular body

	planet.body.setCircle(planet.width / 2);
	gravityGraphics.drawCircle(planet.x, planet.y, planet.width+planet.gravityRadius);
},
startZoom:function(pointer){
    zooming = true;
    if (pointer.button === Phaser.Mouse.LEFT_BUTTON) {
        zoomAmount = -0.05;
    }
    else {
        zoomAmount = 0.05;
    }
    console.log(zoomAmount);

},

stopZoom:function(pointer){
    zooming = false;
},

addPoints:function(pointer) {
 if(this.points / 5 >= 8 )
     this.points += 5;
 else if(this.points / 5 >= 4 )
     this.points += 2.5;
 else {
     this.points += 1;
 }
}
};
