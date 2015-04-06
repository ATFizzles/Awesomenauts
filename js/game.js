
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		//adding variables that we need now and for the future
		//assigning values to these variables
		score : 0,
		option1: "",
		option2: "",
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
		spearTimer: 15,
		player: "",
		exp: 0,
		gold: 0,
		ability1: 0,
		ability2: 0,
		ability3: 0,
		skill1: 0,
		skill2: 0,
		skill3: 0,
		exp1: 0,
		exp2: 0,
		exp3: 0,
		exp4: 0,
		win: "",
		pausePos: "",
		buyscreen: "",
		buytext: "",
		minmap: "",
		miniPlayer: ""
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


	//sets SPENDEXP screen with a random value of 112
	me.state.SPENDEXP = 112;

	me.state.LOAD = 113;
	me.state.NEW = 114;


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
		//registering SpendGold class
		me.pool.register("SpendGold", game.SpendGold);
		//registering spear class
		me.pool.register("spear", game.SpearThrow);
		//registering minmap class
		me.pool.register("MinMap", game.MinMap, true);
		me.pool.register("MiniPlayerLocation", game.MiniPlayerLocation, true);

		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		//new SPENDEXP file
		me.state.set(me.state.SPENDEXP, new game.SpendExp());
		//new LoadProfle file
		me.state.set(me.state.LOAD, new game.LoadProfile());
		//new NewProfile file
		me.state.set(me.state.NEW, new game.NewProfile());

		// Start the game.
		//when game first starts...goes to title screen
		me.state.change(me.state.MENU);
	}
};
