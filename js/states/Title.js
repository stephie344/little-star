LittleStar.Title = function(game)
{
  this.logo;
  this.menuButton;

  this.music;

};

LittleStar.Title.prototype =
{
  create: function()
  {
    // game logo
    // this.logo = this.add.sprite(this.world.centerX, this.world.centerY, 'logo');
    // this.logo.anchor.setTo(0.5, 0.5);

    // music (volume 1.0, loop: true)
    this.music = this.add.audio('music', 1.0, true);
    this.music.play();

    // proceed button
    this.menuButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // reset zoom & world rotation
    this.game.camera.scale.x = 1.0;
    this.game.camera.scale.y = 1.0;
    this.game.world.rotation = 0.0;

    // text message
    let text = this.add.text(this.world.centerX, this.world.centerY + (0.4 * this.world.height),
      "Press Space Bar!",
      {
        font: "48px Arial",
        fill: "#ff0000",
        textAlign: "center"
      });
    text.anchor.set(0.5, 0.5);

    this.game.add.sprite(0, 0, "menu");

  },
  update: function()
  {
    //this.logo.rotation += 0.01;

    // if menuButton is pressed start Game state
    if (this.menuButton.isDown)
    {
      this.game.sound.stopAll();
      this.state.start('Game');
    }
  }
};
