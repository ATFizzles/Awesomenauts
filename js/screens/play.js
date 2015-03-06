game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		//console log for experience and experience2 variables
		console.log(game.data.exp);
		console.log(game.data.exp2);

		//loads the proper level within game
		me.levelDirector.loadLevel("level01");
		//resets player position
		this.resetPlayer(0, 420);
		//new gametimermanager variable
		var gameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
		//adds gametimermanager variable to the world
		me.game.world.addChild(gameTimerManager, 0);

		//new heroDeathManager variable
		var heroDeathManager = me.pool.pull("HeroDeathManager", 0, 0, {});
		//adds herodeathmanager variable to the world
		me.game.world.addChild(heroDeathManager, 0);

		//new experienceManager variable
		var experienceManager = me.pool.pull("ExperienceManager", 0, 0, {});
		//adds experienceManager variable to the world
		me.game.world.addChild(experienceManager, 0);

		//binds right key for movement
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		//binds left key for left movement
		me.input.bindKey(me.input.KEY.LEFT, "left");
		//binds space bar for jump
		me.input.bindKey(me.input.KEY.SPACE, "jump");
		//binds A key for attack
		me.input.bindKey(me.input.KEY.A, "attack");
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},

	//new reset player function 
	//passes x and y
	resetPlayer: function(x, y){
		//adds player by pulling instance of that player
		game.data.player = me.pool.pull("player", x, y, {});
		//adds player to world and chooses where the character spawns
		me.game.world.addChild(game.data.player, 5);
	}
});
