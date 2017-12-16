
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

  this.playerForceLeftRight = 0;
  this.playerSpeed = 30;

  this.alien;

  this.buttons;

  // a force reducer to let the simulation run smoothly

  this.forceReducer = 0.005;


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
      this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH / 2), -(LittleStar.SCREEN_HEIGHT / 2), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      //this.game.world.setBounds(-(LittleStar.SCREEN_WIDTH), -(LittleStar.SCREEN_HEIGHT), (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      //this.game.world.setBounds(0, 0, (LittleStar.SCREEN_WIDTH), (LittleStar.SCREEN_HEIGHT));
      // adding groups

  		this.crateGroup = this.game.add.group();
  		this.planetGroup = this.game.add.group();
        this.bullets = this.game.add.group();

        this.debugGroups = [this.crateGroup, this.planetGroup, this.bullets];

		// adding graphic objects

		gravityGraphics = this.add.graphics(0, 0);
    	gravityGraphics.lineStyle(2,0xffffff,0.5);

		// stage setup

		this.stage.backgroundColor = "#222222";

		// physics initialization

        for (var i = 0; i < 0; i++) {
            var bullet = bullets.create(this.game.rnd.integerInRange(200, 1700), this.game.rnd.integerInRange(-200, 400), 'crate');
            this.game.physics.p2.enable(bullet,false);
        }
        cursors = this.game.input.keyboard.createCursorKeys();
        //ship = this.game.add.sprite(0, 0, 'planet');
        this.addPlanet(0, 0, 400, 250, "bigplanet");

        //this.game.physics.p2.enable(ship);
        //ship.body.static = true;
		// adding a couple of planets. Arguments are:
		// x position
		// y position
		// gravity radius
		// gravity force
		// graphic asset
        this.addPlanet(0, 0, 400, 250, "bigplanet");

		// waiting for player input
		this.input.onDown.add(this.addCrate, this);
    this.cursors = this.input.keyboard.createCursorKeys();

        // buttons
    this.buttons = this.input.keyboard.addKeys(
        {
          zoom: Phaser.KeyCode.Z,
        }
      );
    this.buttons.zoom.onDown.add(this.startZoom, this);
    this.buttons.zoom.onUp.add(this.stopZoom, this);
    size.setTo(-960, -600, 1920, 1200);
},
  update: function()
  {

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
        this.playerForceLeftRight = this.playerSpeed;
    }
    else if (this.cursors.right.isDown)
    {
        this.playerForceLeftRight = -this.playerSpeed;
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

    this.crateGroup.forEachAlive(this.accelerateToObject,this, this.playerForceLeftRight, 80);

    this.playerForceRight = 0;
    this.playerForceLeft = 0;
  },

  moveBullets: function(bullet) {
       this.accelerateToObject(bullet, 0, 40);  //start accelerateToObject on every bullet
  },

  accelerateToObject: function(obj1, forceLeftRight, speed) {
      if (typeof speed === 'undefined') { speed = 30; }

        this.planetGroup.forEachAlive(
          (member) =>
          {
            var angle = Math.atan2(member.y - obj1.y, member.x - obj1.x);
            obj1.body.rotation = angle + this.game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
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
},
// function to add a crate
addCrate: function(e){

    var radius = Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2));
    console.log("radius: " + radius);

    console.log("x: " + e.x);
    console.log("y: " + e.y);

    e.x = e.x - LittleStar.SCREEN_WIDTH / 2;
    e.y = e.y - LittleStar.SCREEN_HEIGHT / 2;

    console.log("new x: " + e.x);
    console.log("new y: " + e.y);

    console.log("asin: " + Math.asin(e.x / radius));
    console.log("acos: " + Math.acos(e.y / radius));

    console.log("rotation: " + this.game.world.rotation)

    console.log("new sin: " + (Math.asin(e.x / radius) - this.game.world.rotation));
    console.log("new cos: " + (Math.acos(e.y / radius) - this.game.world.rotation));

    var x = radius * Math.sin(Math.asin((e.x / radius) - this.game.world.rotation));//this.game.world.rotation + 45);
    var y = radius * Math.cos(Math.acos((e.y / radius) - this.game.world.rotation));//this.game.world.rotation + 45);

	var crateSprite = this.game.add.sprite(0, -150, "crate");
    //var crateSprite = this.game.add.sprite(x, y, "crate");
	this.crateGroup.add(crateSprite);
	this.game.physics.p2.enable(crateSprite);
},

// function to add a planet

addPlanet: function(posX, posY, gravityRadius, gravityForce, asset){
	var planet = this.game.add.sprite(posX, posY, asset);
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
},

stopZoom:function(pointer){
    zooming = false;
},

};
