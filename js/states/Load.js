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

    this.load.image("menu", "assets/sprites/menu_small.png");
    this.load.image("credits", "assets/sprites/credits_small.png");
  	this.load.image("platform", "assets/sprites/platform.png");
    this.load.image("erde", "assets/sprites/erde.png");
    this.load.image("player", "assets/sprites/player/p.png");
    for(var i = 0; i <= 15; i++)
    {
        this.load.image("player"+i, "assets/sprites/player/p"+i+".png");
    }
    for(var i = 0; i < 15; i++)
    {
        this.load.image("enemy"+i, "assets/sprites/enemies/e"+i+".png");
    }


    this.load.image('bg', 'assets/kenney_physicsAssets_v2/bgs/colored_desert.png');
    this.load.atlasXML('aliens', 'assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_aliens.png','assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_aliens.xml' );
    this.load.atlasXML('stones', 'assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_stone.png','assets/kenney_physicsAssets_v2/Spritesheet/spritesheet_stone.xml' );

    //this.game.load.physics("physics", "assets/data.json");

    // audio
    let music = this.load.audio('music', 'assets/audio/backgroundmusic.mp3');// sfx
    let ping = this.load.audio('ping', 'assets/audio/p-ping.mp3');
    let sword = this.load.audio('sword', 'assets/audio/sword.mp3');
    let jumpsound = this.load.audio('jumpsound', 'assets/audio/Sounds/jump_01.mp3');
    let bigjumpsound = this.load.audio('bigjumpsound', 'assets/audio/Sounds/weeee.mp3');
    let intro = this.load.audio('intro', 'assets/audio/Sounds/von_himmel.mp3');
    let dead = this.load.audio('dead', 'assets/audio/Sounds/neeeein.mp3');
    let winner = this.load.audio('winner', 'assets/audio/Sounds/satt.mp3');
    let eatenemy = this.load.audio('eatenemy', 'assets/audio/Sounds/nom_yery_short.mp3');

    // All used keys to be able to wait for sound file decoding (see create)
    // INFO: here we use 'load' to add audio to the Phaser Cache,
    // therefore we need to pass cache keys to to setDecodedCallback,
    // as opposed to the actual audio objects when using 'add' (see e.g. https://phaser.io/examples/v2/audio/loop)
    this.audioKeys = [ 'music', 'ping', 'sword'];

  },
  loadUpdate: function()
  {
    this.loadingLabel.text = 'loading - ' + this.load.progress + '%';
  },
  create: function()
  {
    // Wait for encoded files to be decoded, if completed start game state (onDecoded)
    // IMPORTANT: this cannot be done in preload, since it relies on this.audioKeys
    // existing in the Phaser.Cache, which can only be assured now
    this.sound.setDecodedCallback(this.audioKeys, this.onDecoded, this);
  },
  onDecoded: function()
  {
    // start next state
    this.state.start('Title');
  },
};
