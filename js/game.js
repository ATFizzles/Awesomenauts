
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	//changes and sets width and height of screen
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, '1.0')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		//adding player to pool of objects that you can use
		//true says you can make multiple instances of the player
		me.pool.register("player", game.PlayerEntity, true);

		//registering both bases (show up on screen)
		me.pool.register("PlayerBase", game.PlayerBaseEntity);
		me.pool.register("EnemyBase", game.EnemyBaseEntity);
		//registering EnemyCreep class
		me.pool.register("EnemyCreep", game.EnemyCreep, true);
		//registering GameManager class, dont need to set to true cuz only one of them
		me.pool.register("GameManager", game.GameManager);

		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// Start the game.
		me.state.change(me.state.PLAY);
	}
};
