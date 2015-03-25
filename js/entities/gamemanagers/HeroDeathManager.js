//new HeroDeathManager file
//HeroDeathManager class being created
game.HeroDeathManager = Object.extend({
	//new init function
	//parameters are x, y, and settings
	init: function(x, y, settings){
		//always updates function
		this.alwaysUpdate = true;
	},

	//new update function
	update: function(){
		//if player dies...
		if(game.data.player.dead){
			//removes character from the map
			me.game.world.removeChild(game.data.player);
			//respawns player at (10, 0)
			me.state.current().resetPlayer(10, 0);
		}
		//tells update to actually do stuff
		return true;
	}
});