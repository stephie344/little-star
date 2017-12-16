LittleStar.Load = function(game)
{
  // label for displaying loading information
  this.loadingLabel;
};

LittleStar.Load.prototype =
{
  preload: function()
  {
    // loading text
    this.loadingLabel = this.add.text(this.world.centerX, this.world.centerY, 'loading - 0%',
    {
      font: '30px Arial',
      fill: '#ffffff'
    });
    this.loadingLabel.anchor.setTo(0.5, 0.5);

    // progress bar
    let progressBar = this.add.sprite(this.world.centerX - (0.5 * this.cache.getImage('progressBar').width),
      this.world.centerY + 30, 'progressBar');
    let progressBarOutline = this.add.sprite(this.world.centerX - (0.5 * this.cache.getImage('progressBarOutline').width),
      this.world.centerY + 30, 'progressBarOutline');
    this.load.setPreloadSprite(progressBar); // automatically scales progress bar

    // assets

	this.load.image("crate", "assets/sprites/crate.png");
	this.load.image("planet", "assets/sprites/planet.png");
	this.load.image("bigplanet", "assets/sprites/bigplanet.png");

	this.load.image("platform", "assets/sprites/platform.png");
    this.load.image("erde", "assets/sprites/erde.png");

	this.load.image("player0", "assets/sprites/player/p0.png");
	this.load.image("player1", "assets/sprites/player/p1.png");
	this.load.image("player2", "assets/sprites/player/p2.png");
	this.load.image("player3", "assets/sprites/player/p3.png");
	this.load.image("player4", "assets/sprites/player/p4.png");
	this.load.image("player5", "assets/sprites/player/p5.png");

	this.load.image("enemy0", "assets/sprites/enemies/e0.png");
	this.load.image("enemy1", "assets/sprites/enemies/e1.png");
	this.load.image("enemy2", "assets/sprites/enemies/e2.png");
	this.load.image("enemy3", "assets/sprites/enemies/e3.png");
	this.load.image("enemy4", "assets/sprites/enemies/e4.png");
	this.load.image("enemy5", "assets/sprites/enemies/e5.png");

    this.load.image('bg', 'assets/kenney_physicsAssets_v2/bgs/colored_desert.png');
    this.load.atlasXML('aliens', 'assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_aliens.png','assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_aliens.xml' );
    this.load.atlasXML('stones', 'assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_stone.png','assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_stone.xml' );

    this.game.load.physics("physics", "assets/data.json");

  },
  loadUpdate: function()
  {
    this.loadingLabel.text = 'loading - ' + this.load.progress + '%';
  },
  create: function()
  {
    // start next state
    this.state.start('Game');
  }
};
