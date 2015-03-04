//whole class that manages timers
//not an entity, just an object
game.GameTimerManager = Object.extend({
	//uses same functions as usual
	//constructor function
	init: function(x, y, settings){
		//setting key variables
		this.now = new Date().getTime();
		//keeps track of the last creep that spawned
		this.lastCreep = new Date().getTime();
		//new paused function
		this.paused = false;
		//keeps program updating
		this.alwaysUpdate = true;
	},
	//updates at the end
	update: function(){
		//keeps track of timer
		this.now = new Date().getTime();
		//call to the goldTimerCheck function
		this.goldTimerCheck();
		//call to the creepTimerCheck function
		this.creepTimerCheck();

		return true;
	},

	//new goldTimerCheck function
	goldTimerCheck: function(){
		//keeps track of the amount of gold you get per creep
		//rounds to 20 on one second interval
		//makes sure creeps dont spawn within a second
		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
			//gives one gold per creep kill
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}
	},

	//new creepTimerCheck function
	creepTimerCheck: function(){
		//keeps track of if it needs to make a new creep
		//rounds to 10 on one second interval
		//makes sure creeps dont spawn within a second
		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
			//updates timer to this.now
			this.lastCreep = this.now;
			//builds creep
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			//adds creep into the world
			me.game.world.addChild(creepe, 5);
		}
	}
});

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

//ExperienceManager class being created
game.ExperienceManager = Object.extend({
	//new init function
	init: function(x, y, settings){
		//always updates function
		this.alwaysUpdate = true;
		this.gameOver = false;
	},

	//new update function
	update: function(){
		//if I win...
		if(game.data.win === true && !this.gameOver){
			//adds 10 experience
			game.data.exp += 10;
			this.gameOver = true;
		}
		//if I lose...
		else if(game.data.win === false && !this.gameOver){
			//adds 1 experience
			game.data.exp += 1;
			this.gameOver = true;
		}

		console.log(game.data.exp);

		//tells update to actually do stuff
		return true;

	}
	
});