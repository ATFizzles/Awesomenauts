//creates new SpendExp class
game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//adds title screen image
		//0, 0 is top left of screen
		//-10 puts exp screen in back in z layer
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")), -10);

		//registers f1-f5 keys during exp screen
		me.input.bindKey(me.input.KEY.F1, "F1");
		me.input.bindKey(me.input.KEY.F2, "F2");
		me.input.bindKey(me.input.KEY.F3, "F3");
		me.input.bindKey(me.input.KEY.F4, "F4");
		me.input.bindKey(me.input.KEY.F5, "F5");
		//new exp1cost variable
		//equals...
		var exp1cost = ((game.data.exp1 + 1) * 10);
		//adding new game text
		//renderable means we are drawing something
		me.game.world.addChild(new (me.Renderable.extend({
			//new init function
			init: function(){
				//call to super class
				//passes in info
				//sets text location
				this._super(me.Renderable, 'init', [10, 10, 300, 50]);
				//font settings
				this.font = new me.Font("Arial", 26, "white");
			},

			//renderable uses draw function
			//passes renderer
			draw: function(renderer){
				//draws what you want to write on the screen and the coordinates of it
				//adding new coords for text
				this.font.draw(renderer.getContext(), "PRESS F1-F4 TO BUY, F5 TO SKIP", this.pos.x, this.pos.y);
				this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
				//adding spending options with new coords
				this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION    CURRENT LEVEL: " + game.data.exp1.toString() + " COST: " + exp1cost, this.pos.x, this.pos.y + 100);
				this.font.draw(renderer.getContext(), "F2: ADD STARTING GOLD " + game.data.exp.toString(), this.pos.x, this.pos.y + 150);
				this.font.draw(renderer.getContext(), "F3: INCREASE ATTACK DAMAGE " + game.data.exp.toString(), this.pos.x, this.pos.y + 200);
				this.font.draw(renderer.getContext(), "F4: INCREASE STARTING HEALTH " + game.data.exp.toString(), this.pos.x, this.pos.y + 250);
			}

		})));

		//building event handler
		//when a key is pressed
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge){
			//checks all buttons f1-f5
			//determines which one is being picked
			if(action === "F1"){
				//if experience is greater than or equal to 
				//the cost of exp1
				if(game.data.exp >= exp1cost){
					//exp 1 level +1
					game.data.exp1 += 1;
					//subtracts cost from total experience
					game.data.exp -= exp1cost;
					//starts game
					me.state.change(me.state.PLAY);
				}
			}
			else{
				console.log("not enough exp");
			}
			else if(action === "F2"){

			}
			else if(action === "F3"){
				
			}
			else if(action === "F4"){
				
			}
			else if(action === "F5"){
				//sends user to game screen
				me.state.change(me.state.PLAY);
			}
		});

	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		//unregisters f1-f5 keys during game
		me.input.unbindKey(me.input.KEY.F1, "F1");
		me.input.unbindKey(me.input.KEY.F2, "F2");
		me.input.unbindKey(me.input.KEY.F3, "F3");
		me.input.unbindKey(me.input.KEY.F4, "F4");
		me.input.unbindKey(me.input.KEY.F5, "F5");
		//unsubscribes to the handler set up above
		//basically takes away the values of the keys
		me.event.unsubscribe(this.handler);
	}
});