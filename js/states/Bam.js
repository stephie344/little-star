
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


  this.onGround = false;
  this.player;
  this.playerForceLeftRight = 0;
  this.playerSpeed = 10;
  this.playerSize = 1;

  this.alien;

  this.buttons;

  // a force reducer to let the simulation run smoothly

  this.forceReducer = 0.005;


};
var zooming = false;
var zoomAmount = 0;
var cursors;
var size = new Phaser.Rectangle();
var points = 0;
var lastPoints = 0;

LittleStar.Game.prototype =
{
  preload: function ()
  {
      this.physics.startSystem(Phaser.Physics.P2JS);
  },
  create: function ()
  {
      this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH / 2), -(LittleStar.SCREEN_HEIGHT / 2), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      //this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH), -(LittleStar.SCREEN_HEIGHT), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      //this.game.world.setBounds(0, 0, (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      // adding groups

  		this.crateGroup = this.game.add.group();
  		this.planetGroup = this.game.add.group();
        this.bullets = this.game.add.group();
        this.enemyGroup = this.game.add.group();

        this.debugGroups = [this.crateGroup, this.planetGroup, this.bullets];

		// adding graphic objects

		gravityGraphics = this.add.graphics(0, 0);
    	gravityGraphics.lineStyle(2,0xffffff,0.5);

		// stage setup

		this.stage.backgroundColor = "#222222";

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
		this.input.onDown.add(this.addCrate, this);
    this.cursors = this.input.keyboard.createCursorKeys();

        // buttons
    this.buttons = this.input.keyboard.addKeys(
        {
          zoom: Phaser.KeyCode.Z,
          jump: Phaser.KeyCode.SPACEBAR,
          addpoints: Phaser.KeyCode.P,
        }
      );
    this.buttons.zoom.onDown.add(this.startZoom, this);
    this.buttons.zoom.onUp.add(this.stopZoom, this);
    size.setTo(-960, -600, 1920, 1200);

    this.addCrate(0);
    this.player.y;
    this.player.x;
    // camera: set to follow player (follow styles: https://phaser.io/examples/v2/camera/follow-styles)
    this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);


    this.game.camera.scale.x = 40;
    this.game.camera.scale.y = 40;


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
        this.debug = 'You last hit: ' + body.sprite.key;
        if(body.sprite.key == "erde")
            this.onGround = true;
    }
    else
    {
        this.debug  = 'You last hit: The wall :)';
    }

    this.buttons.addpoints.onDown.add(this.addPoints, this);

},
  update: function()
  {



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
        this.player.body.velocity.y = -40;
        this.onGround = false;
    }


    this.crateGroup.forEachAlive(this.moveBullets,this);  //make bullets accelerate to ship

    if (zooming)
        {
            this.game.camera.scale.x += zoomAmount;
            this.game.camera.scale.y += zoomAmount;

            this.game.camera.bounds.x = size.x * this.game.camera.scale.x;
            this.game.camera.bounds.y = size.y * this.game.camera.scale.y;
            this.game.camera.bounds.width = size.width * this.game.camera.scale.x;
            this.game.camera.bounds.height = size.height * this.game.camera.scale.y;

        }

    //this.crateGroup.forEachAlive(this.moveEnemy,this, 80);
    this.enemyGroup.forEachAlive(this.moveEnemy,this, 80);
    this.movePlayer(this.player, 80);


    this.playerForceLeftRight = 0;
    this.game.world.rotation = -this.player.body.rotation - this.game.math.degToRad(180);

    for (var i = 0; i < 7; i++) {
        if(lastPoints != points)
        {
          if (points == i*5) {
            this.game.camera.scale.x = 15 - i * 2;
            this.game.camera.scale.y = 15 - i * 2;
            this.player.width = (points/5) * 4 + 1;
            this.player.height = (points/5) * 4 + 1;
            this.player.body.setCircle(this.player.width / 2);

            this.spawneEnemies();
            lastPoints = points;
          }
      }
    }


    this.game.world.rotation = -this.player.body.rotation;
  },
  setOnGround: function() {
      this.onGround = true;
  },

  moveEnemy: function(bullet, forceLeftRight, speed) {
       this.accelerateToObject(bullet, 0, speed);  //start accelerateToObject on every bullet
  },

  movePlayer: function(bullet, forceLeftRight, speed) {
       this.accelerateToObject(bullet, this.playerForceLeftRight, speed);  //start accelerateToObject on every bullet
  },

  accelerateToObject: function(obj1, forceLeftRight, speed) {
      if (typeof speed === 'undefined') { speed = 30; }

        this.planetGroup.forEachAlive(
          (member) =>
          {
            var angle = Math.atan2(member.y - obj1.y, member.x - obj1.x);
            obj1.body.rotation = angle - this.game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
            obj1.body.force.x = Math.cos(angle) * speed + Math.cos(obj1.body.rotation) * forceLeftRight;    // accelerateToObject
            obj1.body.force.y = Math.sin(angle) * speed + Math.sin(obj1.body.rotation) * forceLeftRight;
          }, this)

  },
  render: function()
  {

        // Debug: highlights all members of all groups
        for (let i = 0; i < this.debugGroups.length; i++)
        {
      this.debugGroups[i].forEachAlive(
        (member) =>
        {
              //this.game.debug.spriteBounds(member);
              this.game.debug.body(member);
              //member.body.debug = true;

        }, this);
    }

    this.game.debug.text(this.debug, 32, 32);
},
spawneEnemies: function(){

/*this.enemyGroup.forEachAlive(
  (member) =>
  {
      member.kill();
  }, this);*/

        for (var type = 0; type < 5; type++) {
            for (var i = 0; i < 10; i++) {
                this.addEnemy(i+ type/5, type);
            }
        }

},
// function to add a crate
addCrate: function(e){

	var crateSprite = this.game.add.sprite(0, -150, "player0");

    crateSprite.width = this.playerSize *4-3;
    crateSprite.height = this.playerSize *4-3;

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

    enemy.width = enemyType * 4 + 1;
    enemy.height = enemyType * 4 + 1;

    //var crateSprite = this.game.add.sprite(x, y, "crate");
	//this.crateGroup.add(enemy);
    this.enemyGroup.add(enemy)
	this.game.physics.p2.enable(enemy);

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
  points += 1;
}
};
