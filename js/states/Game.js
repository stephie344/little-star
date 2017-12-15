
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

  this.alien;

  this.buttons;

  // a force reducer to let the simulation run smoothly

  this.forceReducer = 0.005;

};

LittleStar.Game.prototype =
{
  preload: function ()
  {
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.startSystem(Phaser.Physics.P2JS);

      this.physics.startSystem(Phaser.Physics.BOX2D);
  },
  // changes active physics
  changePhysics: function(physicsKey)
  {
    // destroy all bodies if existing
    this.characterGroup.forEachAlive(
      (member) =>  { if (member.body !== null) member.body.destroy();}, this);
    this.environmentGroup.forEachAlive(
      (member) => {if (member.body !== null) member.body.destroy();}, this);

    // change physics systems
    switch (physicsKey)
    {
      case LittleStar.PHYSICS_NONE:
      break;
      case LittleStar.PHYSICS_ARCADE:
        this.characterGroup.forEachAlive(
          (member) =>
          {
            this.game.physics.arcade.enable(member);
            member.body.collideWorldBounds = true;
            member.body.gravity.y = 500;
            member.body.bounce.y = 0.60;
            member.body.bounce.x = 0.60;
            member.body.enable = true;
          }, this);
          this.environmentGroup.forEachAlive(
            (member) =>
            {
              this.game.physics.arcade.enable(member);
              // member.body.immovable = true;
              member.body.enable = true;
              member.body.collideWorldBounds = true;
            }, this);
        break;
      case LittleStar.PHYSICS_P2:
        this.game.physics.p2.gravity.y = 500;
        this.characterGroup.forEachAlive(
          (member) =>
          {
            this.game.physics.p2.enable(member);
            member.body.setCircle(35);
            // member.body.velocity.y = 500;
            member.body.collideWorldBounds = true;
            member.body.enable = true;
          }, this);
          this.environmentGroup.forEachAlive(
          (member) =>
          {
            this.game.physics.p2.enable(member);
            member.body.collideWorldBounds = true;
            // change body for triangles
            if (member.isTriangle)
            {
              member.body.clearShapes(); // remove body
              // load triangle polygon shape
              // INFO: triangle shape (see assets/data.json):
              // [66.5, 0, 135, 66.5, 0, 66.5] =>
              // 3 points: [x.1,y.1,x.2,y.2,x.3,y.3]
              member.body.loadPolygon("physics", "triangle");

            }
            // member.body.static = true; // can not be moved
            member.body.enable = true;
          }, this);
      default:
        break;
    }

  },
  create: function ()
  {
    // adding groups

        // groups
        this.bgGroup = this.add.group();
        this.environmentGroup = this.add.group();
        this.characterGroup = this.add.group();
        this.debugGroups = [this.characterGroup,this.environmentGroup];

  		crateGroup = this.add.group();
  		planetGroup = this.add.group();

		// adding graphic objects

		gravityGraphics = this.add.graphics(0, 0);
    		gravityGraphics.lineStyle(2,0xffffff,0.5);

		// stage setup

		this.stage.backgroundColor = "#222222";

		// physics initialization



        this.changePhysics(this.activePhysicsSystem);
		//this.game.physics.startSystem(Phaser.Physics.BOX2D);

		// adding a couple of planets. Arguments are:
		// x position
		// y position
		// gravity radius
		// gravity force
		// graphic asset

		this.addPlanet(180, 200, 250, 150, "planet");
    	this.addPlanet(570, 350, 400, 250, "bigplanet");

		// waiting for player input

		this.input.onDown.add(this.addCrate, this);


/*

    // increase lower bound of world for both phyiscs systems
    this.createLowerWorldBound();

    // background
    let bg = this.bgGroup.create(0, 0,'bg');
    bg.width = this.world.width;
    bg.height = this.world.height;

    // ball
    let char = this.characterGroup.create(this.world.centerX, 50, 'aliens', "alienYellow_round.png");
    char.anchor.setTo(0.5);
    char.inputEnabled = true; // enable click events
    char.events.onInputDown.add(
    () =>
    {
      this.pushBall();
    });

    // stones
    let stone1 = this.environmentGroup.create(this.world.centerX, this.lowerWorldBoundY-32, 'stones', "elementStone009.png");
    stone1.anchor.setTo(0.5);
    stone1.isTriangle = true; // set triangle flag for changing shape
    let stone2  = this.environmentGroup.create(this.world.centerX, this.lowerWorldBoundY-103, 'stones', "elementStone015.png");
    stone2.anchor.setTo(0.5);
    // stone = this.environmentGroup.create(this.world.centerX, this.lowerWorldBoundY-200, 'stones', "elementStone016.png");
    // stone.anchor.setTo(0.5);


    // buttons
    this.buttons = this.input.keyboard.addKeys(
      {
        one: Phaser.KeyCode.ONE,
        two: Phaser.KeyCode.TWO,
        three: Phaser.KeyCode.THREE,
        debug: Phaser.KeyCode.D
      }
    );
    this.buttons.debug.onDown.add(() => {this.showBounds = !this.showBounds}, this);
    // physics switch buttons
    this.buttons.one.onDown.add(() => {this.activePhysicsSystem = LittleStar.PHYSICS_NONE; this.changePhysics(this.activePhysicsSystem);}, this);
    this.buttons.two.onDown.add(() => {this.activePhysicsSystem = LittleStar.PHYSICS_ARCADE; this.changePhysics(this.activePhysicsSystem);}, this);
    this.buttons.three.onDown.add(() => {this.activePhysicsSystem = LittleStar.PHYSICS_P2; this.changePhysics(this.activePhysicsSystem);}, this);

    // switch to initial physics system
    this.changePhysics(this.activePhysicsSystem);
*/

}/*,
  pushBall: function()
  {
    this.characterGroup.forEachAlive(
      (member) =>
      {
        if (!member.body) return;

        // random velocity
        member.body.velocity.y = this.rnd.integerInRange(-500, 500);
        member.body.velocity.x = this.rnd.integerInRange(-500, 500);

      }, this);

  }*/,
  update: function()
  {
      /*
    // enable collisions
    this.game.physics.arcade.collide(this.characterGroup, this.environmentGroup);
    this.game.physics.arcade.collide(this.environmentGroup, this.environmentGroup);

    // collide with lower world bounds
    this.game.physics.arcade.collide(this.environmentGroup, this.customBottomBoundArcade);
    this.game.physics.arcade.collide(this.characterGroup, this.customBottomBoundArcade);*/
    // looping through all crates

		for(var i=0;i<crateGroup.total;i++){
			var c = crateGroup.getChildAt(i);

			// looping through all planets

			for(var j=0;j<planetGroup.total;j++){
				var p = planetGroup.getChildAt(j);

				// calculating distance between the planet and the crate

				var distance = Phaser.Math.distance(c.x,c.y,p.x,p.y);

				// checking if the distance is less than gravity radius

				if(distance<p.width/2+p.gravityRadius/2){

					// calculating angle between the planet and the crate

					var angle = Phaser.Math.angleBetween(c.x,c.y,p.x,p.y);

					// add gravity force to the crate in the direction of planet center

					c.body.applyForce(p.gravityForce*Math.cos(angle)*this.forceReducer,p.gravityForce*Math.sin(angle)*this.forceReducer);
				}
			}
		}
  },
  // creates lower world bound for physics systems (high than bottom of screen)
  createLowerWorldBound: function()
  {
    // P2 physics bottom (http://phaser.io/examples/v2/p2-physics/collide-custom-bounds)
    var sim = this.game.physics.p2;
    this.lowerWorldBoundY = this.world.centerY + 150;
    this.customBottomBoundP2 = new p2.Body({ mass: 0, position: [ sim.pxmi(0), sim.pxmi(this.lowerWorldBoundY) ] });
    this.customBottomBoundP2.addShape(new p2.Plane());
    sim.world.addBody(this.customBottomBoundP2);

    // arcade physics invisible wall (http://www.html5gamedevs.com/topic/6194-invisible-walls/)
    this.customBottomBoundArcade = this.add.sprite(0, this.lowerWorldBoundY);
    this.game.physics.arcade.enable(this.customBottomBoundArcade);
    this.customBottomBoundArcade.body.width = this.world.width;
    this.customBottomBoundArcade.body.immovable = true;
    this.customBottomBoundArcade.collideWorldBounds = true;
    this.customBottomBoundArcade.allowGravity = false;

  },
  showBoundingBoxes: function()
  {
    // Debug: highlights all members of all groups
    for (let i = 0; i < this.debugGroups.length; i++)
    {
      this.debugGroups[i].forEachAlive(
        (member) =>
        {
          switch (this.activePhysicsSystem)
          {
            case LittleStar.PHYSICS_NONE:
              // debug sprites only (https://phaser.io/examples/v2/debug/debug-sprite)
              this.game.debug.spriteBounds(member);
              break;
            case LittleStar.PHYSICS_ARCADE:
              // debug arcade physics bodies (https://phaser.io/examples/v2/arcade-physics/body-debug)
              this.game.debug.body(member);
              break;
            case LittleStar.PHYSICS_P2:
              // debug p2 physics bodies (https://phaser.io/examples/v2/p2-physics/world-boundary)
              //this.game.physics.p2.enable(member, true);
              member.body.debug = true;
            default:
              break;
          }
        }, this);
    }

    // draw debug line for lower world bounds
    if (!this.lowerWorldLine)
    {
      // p2 physics
      this.lowerWorldLine = this.add.graphics(0, 0);
      this.lowerWorldLine.lineStyle(3, 0x33FF00); // set a fill and line style
      this.lowerWorldLine.moveTo(0, this.lowerWorldBoundY);
      this.lowerWorldLine.lineTo(this.world.width, this.lowerWorldBoundY);
      // arcade physics
      this.customBottomBoundArcade.body.debug = true;
    }
  },
  render: function()
  {

    // debug text output
    let activePhysicsText;
    switch (this.activePhysicsSystem)
    {
      case LittleStar.PHYSICS_NONE:
        activePhysicsText = "None";
        break;
      case LittleStar.PHYSICS_ARCADE:
        activePhysicsText = "Arcade";
        break;
      case LittleStar.PHYSICS_P2:
        activePhysicsText = "P2";
      default:
        break;
    }
    this.game.debug.text("Press [1,2,3] to change Physics Systems - active: " + activePhysicsText, 5, LittleStar.SCREEN_HEIGHT - 30);
    this.game.debug.text("Click on ball to push it and press [D] to toggle bounding boxes.", 5, LittleStar.SCREEN_HEIGHT - 10);

    // bounding boxes

    if (!this.showBounds)
    {
      // cleanup

      // remove world lower bound line
      if (this.lowerWorldLine)
      {
        this.lowerWorldLine.destroy();
        this.lowerWorldLine = null;
      }

      // turn off debug for p2 phyiscs
      if (this.activePhysicsSystem === LittleStar.PHYSICS_P2)
      for (let i = 0; i < this.debugGroups.length; i++)
        this.debugGroups[i].forEachAlive((member) => {member.body.debug = false;}, this);

      return;
    }

    this.showBoundingBoxes();
},
// function to add a crate
addCrate: function(e){
	var crateSprite = this.game.add.sprite(e.x, e.y, "crate");
	crateGroup.add(crateSprite);
    	this.game.physics.box2d.enable(crateSprite);
},

// function to add a planet

addPlanet: function(posX, posY, gravityRadius, gravityForce, asset){
	var planet = this.game.add.sprite(posX, posY, asset);
	planet.gravityRadius = gravityRadius;
	planet.gravityForce = gravityForce
	planetGroup.add(planet);
	this.game.physics.box2d.enable(planet);
	planet.body.static = true;

	// look how I create a circular body

	planet.body.setCircle(planet.width / 2);
	gravityGraphics.drawCircle(planet.x, planet.y, planet.width+planet.gravityRadius);
}

};
