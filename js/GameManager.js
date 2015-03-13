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
			//gives exp1 + 1 gold
			game.data.gold += (game.data.exp1+1);
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
		//game is not over initially
		this.gameover = false;
	},

	//new update function
	update: function(){
		//if I win...
		//and game isnt over
		if(game.data.win === true && !this.gameover){
			//call to gameOver function
			//passes true
			this.gameOver(true);
		}
		//if I lose...
		//and game isnt over
		else if(game.data.win === false && !this.gameover){
			//call to gameOver function
			//passes false
			this.gameOver(false);
		}

		//tells update to actually do stuff
		return true;

	},

	//new gameOver function
	//passes win
	gameOver: function(win){
		//if player wins
		if(win){
			//adds 10 experience
			game.data.exp += 10;
		}
		else{
			//adds 1 experience
			game.data.exp += 1;
		}
		
		//game is over if player wins
		this.gameOver = true;
		//saves current game variable of experience into save variable
		me.save.exp =  game.data.exp;
		//only for testing purposes
		me.save.exp2 = 4;
	}
	
});

//new SpendGold object
game.SpendGold = Object.extend({
	//new init function
	init: function(x, y, settings){
		//sets game to current time
		this.now = new Date().getTime();
		//keeps track of last time u bought something
		this.lastBuy = new Date().getTime();
		//game isnt paused
		this.paused = false;
		//awlays updates game
		this.alwaysUpdate = true;
		this.updateWhenPaused = true;
		this.buying = false;
	},

	//new update function
	update: function(){
		this.now = new Date().getTime();

		if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
			this.lastBuy = this.now;
			if(!this.buying){
				this.startBuying();
			}
			else{
				this.stopBuying();
			}
		}
		return true;
	},

	startBuying: function(){
		this.buying = true;
		me.state.pause(me.state.PLAY);
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
		game.data.buyscreen.updateWhenPaused = true;
		game.data.buyscreen.setOpacity(0.8);
		me.game.world.addChild(game.data.buyscreen, 34);
		game.data.player.body.setVelocity(0, 0);
	},

	stopBuying: function(){
		this.buying = false;
		me.state.resume(me.state.PLAY);
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		me.game.removeChild(game.data.buyscreen);

	}
});