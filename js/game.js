
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		//adding variables that we need now and for the future
		//assigning values to these variables
		score : 0,
		enemyBaseHealth: 1,
		playerBaseHealth: 1,
		enemyCreepHealth: 10,
		playerHealth: 10,
		enemyCreepAttack: 1,
		playerAttack: 5,
		//orcBaseDamage: 10,
		//orcBaseHealth: 100,
		//orcBaseSpeed: 3,
		//orcBaseDefense: 0,
		gloopHealth: 5,
		gloopAttack: 5,
		gloopAttackTimer: 1000,
		gloopMoveSpeed: 5,
		playerAttackTimer: 1000,
		enemyCreepAttackTimer: 1000,
		playerMoveSpeed: 5, 
		creepMoveSpeed: 5,
		gameTimeManager: "",
		heroDeathManager: "",
		player: "",
		exp: 0,
		gold: 0,
		exp1: 0,
		exp2: 0,
		exp3: 0,
		exp4: 0,
		win: ""
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

	//creates save file that keeps track of these 5 variables
	me.save.add({exp: 0, exp1: 0, exp2: 0, exp3: 0, exp4: 0});

	//sets SPENDEXP screen with a random value of 112
	me.state.SPENDEXP = 112;

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

		me.pool.register("gloop", game.Gloop, true);
		//registering GameManager class, dont need to set to true cuz only one of them
		me.pool.register("GameTimerManager", game.GameTimerManager);
		//registering HeroDeathManager class
		me.pool.register("HeroDeathManager", game.HeroDeathManager);
		//registering ExperienceManager class
		me.pool.register("ExperienceManager", game.ExperienceManager);

		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		//new SPENDEXP file
		me.state.set(me.state.SPENDEXP, new game.SpendExp());

		// Start the game.
		//when game first starts...goes to title screen
		me.state.change(me.state.MENU);
	}
};
