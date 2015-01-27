game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		//loads the proper level within game
		me.levelDirector.loadLevel("level01");
		//adds player by pulling instance of that player
		var player = me.pool.pull("player", 0, 420, {});
		//adds player to world and chooses where the character spawns
		me.game.world.addChild(player, 5);
		//binds right key for movement
		me.input.bindKey(me.input.KEY.RIGHT, "right");
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
	}
});
