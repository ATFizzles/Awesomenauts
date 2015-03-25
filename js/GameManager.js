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

