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
		//updates when paused
		this.updateWhenPaused = true;
		//are not currently buying
		this.buying = false;
	},

	//new update function
	update: function(){
		//updates timers
		this.now = new Date().getTime();
		//if buy button is pressed...
		//and its been one second since last buy...
		if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
			//last buy was now
			this.lastBuy = this.now;
			//if you are not currently buying...
			if(!this.buying){
				//calls startBuying function
				this.startBuying();
			}
			else{
				//calls stopBuying
				this.stopBuying();
			}
		}
		return true;
	},

	//new startBuying function
	startBuying: function(){
		this.buying = true;
		//when you start buying, game will pause
		me.state.pause(me.state.PLAY);
		//sets pausePos to current location
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		//makes screen a new sprite
		//sets x and y position
		//gets image
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
		//updates when screen is up
		game.data.buyscreen.updateWhenPaused = true;
		//makes buy screen opague
		game.data.buyscreen.setOpacity(0.8);
		//adds screen to the game
		me.game.world.addChild(game.data.buyscreen, 34)
		//makes sure player doesnt move when game is paused
		game.data.player.body.setVelocity(0, 0);
		me.state.pause(me.state.PLAY);
		//setting up keys
		//binding f1-f6 keys
		me.input.bindKey(me.input.KEY.F1, "F1", true);
		me.input.bindKey(me.input.KEY.F2, "F2", true);
		me.input.bindKey(me.input.KEY.F3, "F3", true);
		me.input.bindKey(me.input.KEY.F4, "F4", true);
		me.input.bindKey(me.input.KEY.F5, "F5", true);
		me.input.bindKey(me.input.KEY.F6, "F6", true);
		//calls setBuyText function
		this.setBuyText();
	},

	//new setBuyText function
	setBuyText: function(){
		//making something stored in buytext
		game.data.buytext = new (me.Renderable.extend({
			//new init function
			init: function(){
				//call to super class
				//passes in info
				//sets text location
				this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
				//font settings
				this.font = new me.Font("Arial", 26, "white");
				//updates when game is paused
				this.updateWhenPaused = true;
				//always updates game
				this.alwaysUpdate = true;
			},

			//renderable uses draw function
			//passes renderer
			draw: function(renderer){
				//draws what you want to write on the screen and the coordinates of it
				//adding new coords for text
				this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT", this.pos.x, this.pos.y);
			}

		}));
		//adds buytext variable to game
		me.game.world.addChild(game.data.buytext, 35);
	},

	//new stopBuying function
	stopBuying: function(){
		this.buying = false;
		//when you stop buying, game will start
		me.state.resume(me.state.PLAY);
		//returns normal speed to player when unpaused
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		//removes buy screen when game is unpaused
		me.game.removeChild(game.data.buyscreen);
		//unbinding f1-f6 keys
		me.input.unbindKey(me.input.KEY.F1, "F1", true);
		me.input.unbindKey(me.input.KEY.F2, "F2", true);
		me.input.unbindKey(me.input.KEY.F3, "F3", true);
		me.input.unbindKey(me.input.KEY.F4, "F4", true);
		me.input.unbindKey(me.input.KEY.F5, "F5", true);
		me.input.unbindKey(me.input.KEY.F6, "F6", true);
		//removes buytext from game
		me.game.world.removeChild(game.data.buytext);
	}
});