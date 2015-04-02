//creates new NewProfile class
game.NewProfile = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//adds new screen image
		//0, 0 is top left of screen
		//-10 puts exp screen in back in z layer
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("new-screen")), -10);
		//makes inputs visible
		document.getElementById("input").style.visibility = "visible";
		//makes register visible
		document.getElementById("register").style.visibility = "visible";



		//unbinds B, Q, E, W, and A keys during new screen
		me.input.unbindKey(me.input.KEY.B);
		me.input.unbindKey(me.input.KEY.Q);
		me.input.unbindKey(me.input.KEY.E);
		me.input.unbindKey(me.input.KEY.W);
		me.input.unbindKey(me.input.KEY.A);

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
				this.font.draw(renderer.getContext(), "PICK A USERNAME AND PASSWORD", this.pos.x, this.pos.y);
			}

		})));

	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		//makes input back to invisible
		document.getElementById("input").style.visibility = "hidden";
		//makes input back to invisible
		document.getElementById("register").style.visibility = "hidden";
	}
});