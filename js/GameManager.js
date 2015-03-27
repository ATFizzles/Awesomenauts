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







//---------------------------------------------------------------------------------------------------------------------------------------------------------------





/*

game.Pause = Object.extend({
	//new init function
	init: function(x, y, settings){
		//sets game to current time
		this.now = new Date().getTime();
		//game isnt paused
		this.paused = false;
		//awlays updates game
		this.alwaysUpdate = true;
		//updates when paused
		this.updateWhenPaused = true;
	},

	//new update function
	update: function(){
		//updates timers
		this.now = new Date().getTime();
		//if buy button is pressed...
		//and its been one second since last buy...
		if(me.input.isKeyPressed("pause"){
			
			this.pauseScreen();
		}


		return true;
	},

	//new startBuying function
	pauseScreen: function(){
		me.state.pause(me.state.PLAY);
		//sets pausePos to current location
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		//makes screen a new sprite
		//sets x and y position
		//gets image
		game.data.pausescreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('new-screen'));
		//updates when screen is up
		game.data.pausescreen.updateWhenPaused = true;
		//makes buy screen opague
		game.data.pausescreen.setOpacity(0.8);
		//adds screen to the game
		me.game.world.addChild(game.data.pausescreen, 34)
		//makes sure player doesnt move when game is paused
		game.data.player.body.setVelocity(0, 0);
		me.state.pause(me.state.PLAY);
	},

	

	//new stopBuying function
	stopPause: function(){
		//when you stop buying, game will start
		me.state.resume(me.state.PLAY);
		//returns normal speed to player when unpaused
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		//removes buy screen when game is unpaused
		me.game.world.removeChild(game.data.pausescreen);
	},

	

*/