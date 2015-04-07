game.pause = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//adds title screen image
		//0, 0 is top left of screen
		//-10 puts title screen in back in z layer
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("pause-screen")), -10);

		
		//adding new game text
		//renderable means we are drawing something
		me.game.world.addChild(new (me.Renderable.extend({
			//new init function
			init: function(){
				//call to super class
				//passes in info
				//sets text location
				this._super(me.Renderable, 'init', [270, 240, 300, 50]);
				//font settings
				this.font = new me.Font("Arial", 46, "white");
			},

			//renderable uses draw function
			//passes renderer
			draw: function(renderer){
				//draws what you want to write on the screen and the coordinates of it
				this.font.draw(renderer.getContext(), "PAUSED", this.pos.x, this.pos.y);
			}

		
		})));


	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {

	}
});


		