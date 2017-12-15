window.onload = function()
{
    // game variable
    LittleStar.phasergame = new Phaser.Game(LittleStar.SCREEN_WIDTH, LittleStar.SCREEN_HEIGHT);

    // add states
    LittleStar.phasergame.state.add('Boot', LittleStar.Boot);
    LittleStar.phasergame.state.add('Load', LittleStar.Load);
    LittleStar.phasergame.state.add('Title', LittleStar.Title);
    LittleStar.phasergame.state.add('Game', LittleStar.Game);

    // start Title state
    LittleStar.phasergame.state.start('Boot');
};
