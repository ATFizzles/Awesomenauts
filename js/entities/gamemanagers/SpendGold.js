//new SpendGold file
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

		//calls checkBuyKeys function
		this.checkBuyKeys();

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
				//spaces out text by 40s
				this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT.  Current Gold: " + game.data.gold, this.pos.x, this.pos.y);
				//skill 1 text
				this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level: " + game.data.skill1 + "Cost: " + ((game.data.skill1+1)*10), this.pos.x, this.pos.y + 40);
				//skill 2 text
				this.font.draw(renderer.getContext(), "Skill 2: Run Faster.  Current Level: " + game.data.skill2 + "Cost: " + ((game.data.skill2+1)*10), this.pos.x, this.pos.y + 80);
				//skill 3 text
				this.font.draw(renderer.getContext(), "Skill 3: Increase Health.  Current Level: " + game.data.skill3 + "Cost: " + ((game.data.skill3+1)*10), this.pos.x, this.pos.y + 120);
				//ability 1 text
				this.font.draw(renderer.getContext(), "Q Ability: Speed Burst.  Current Level: " + game.data.ability1 + "Cost: " + ((game.data.ability1+1)*10), this.pos.x, this.pos.y + 160);
				//ability 2 text
				this.font.draw(renderer.getContext(), "W Ability: Eat Your Creep For Health: " + game.data.ability2 + "Cost: " + ((game.data.ability2+1)*10), this.pos.x, this.pos.y + 200);
				//ability 3 text
				this.font.draw(renderer.getContext(), "E Ability: Throw Your Spear: " + game.data.ability3 + "Cost: " + ((game.data.ability3+1)*10), this.pos.x, this.pos.y + 240);
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
		me.game.world.removeChild(game.data.buyscreen);
		//unbinding f1-f6 keys
		me.input.unbindKey(me.input.KEY.F1, "F1", true);
		me.input.unbindKey(me.input.KEY.F2, "F2", true);
		me.input.unbindKey(me.input.KEY.F3, "F3", true);
		me.input.unbindKey(me.input.KEY.F4, "F4", true);
		me.input.unbindKey(me.input.KEY.F5, "F5", true);
		me.input.unbindKey(me.input.KEY.F6, "F6", true);
		//removes buytext from game
		me.game.world.removeChild(game.data.buytext);
	},

	//new checkBuyKeys function
	checkBuyKeys: function(){
		//if F1 pressed...
		if(me.input.isKeyPressed("F1")){
			//calls checkCost function
			//passes 1 since we r using skill 1
			if(this.checkCost(1)){
				//calls makePurchase function
				this.makePurchase(1);
			}
		}
		//if F2 pressed...
		//same for every else if
		//passes certain number
		else if(me.input.isKeyPressed("F2")){
			if(this.checkCost(2)){
				this.makePurchase(2);
			}
		}
		//if F3 pressed...
		else if(me.input.isKeyPressed("F3")){
			if(this.checkCost(3)){
				this.makePurchase(3);
			}
		}
		//if F4 pressed
		else if(me.input.isKeyPressed("F4")){
			if(this.checkCost(4)){
				this.makePurchase(4);
			}
		}
		//if F5 pressed
		else if(me.input.isKeyPressed("F5")){
			if(this.checkCost(5)){
				this.makePurchase(5);
			}
		}
		//if F6 pressed
		else if(me.input.isKeyPressed("F6")){
			if(this.checkCost(6)){
				this.makePurchase(6);
			}
		}
	},

	//new checkCost function
	//parameter is skill
	checkCost: function(skill){
		//if skill is 1 and amount of gold is greater or equal than the cost of skill...
		if(skill===1 && (game.data.gold >= ((game.data.skill1+1)*10))){
			return true;
		}
		//if skill is 2 and amount of gold is greater or equal than the cost of skill...
		else if(skill===2 && (game.data.gold >= ((game.data.skill2+1)*10))){
			return true;
		}
		//same for every other else if
		else if(skill===3 && (game.data.gold >= ((game.data.skill3+1)*10))){
			return true;
		}
		else if(skill===4 && (game.data.gold >= ((game.data.ability1+1)*10))){
			return true;
		}
		else if(skill===5 && (game.data.gold >= ((game.data.ability2+1)*10))){
			return true;
		}
		else if(skill===6 && (game.data.gold >= ((game.data.ability3+1)*10))){
			return true;
		}
		//if there isnt enough gold...cant buy anything
		else{
			return false;
		}
	},

	//new makePurchase function
	makePurchase: function(skill){
		if(skill === 1){
			//gold amount subtracted by cost of skill 1
			game.data.gold -= ((game.data.skill1 +1)*10);
			//increases skill level
			game.data.skill1 += 1;
			//for this skill it adds to player attack
			game.data.playerAttack += 1;
		}
		else if(skill === 2){
			//gold amount subtracted by cost of skill 2
			game.data.gold -= ((game.data.skill2 +1)*10);
			//increases skill level
			game.data.skill2 += 1;
		}
		else if(skill === 3){
			//gold amount subtracted by cost of skill 3
			game.data.gold -= ((game.data.skill3 +1)*10);
			//increases skill level
			game.data.skill3 += 1;
		}
		else if(skill === 4){
			//gold amount subtracted by cost of ability 1
			game.data.gold -= ((game.data.ability1 +1)*10);
			//increases ability level
			game.data.ability1 += 1;
		}
		else if(skill === 5){
			//gold amount subtracted by cost of ability 2
			game.data.gold -= ((game.data.ability2 +1)*10);
			//increases ability level
			game.data.ability2 += 1;
		}
		else if(skill === 6){
			//gold amount subtracted by cost of ability 3
			game.data.gold -= ((game.data.ability3 +1)*10);
			//increases ability level
			game.data.ability3 += 1;
		}
	}
});