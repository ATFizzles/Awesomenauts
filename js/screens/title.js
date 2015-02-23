game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		//adds title screen image
		//0, 0 is top left of screen
		//-10 puts title screen in back in z layer
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("title-screen")), -10);

		//adding new key called start
		me.input.bindKey(me.input.KEY.ENTER, "start");
		//addind text
		//renderable means we are drawing something
		me.game.world.addChild(new (me.Renderable.extend({
			//new init function
			init: function(){
				//call to super class
				//passes in info
				//sets text location
				this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
				//font settings
				this.font = new me.Font("Arial", 46, "white");
			},

			//renderable uses draw function
			//passes renderer
			draw: function(renderer){
				//draws what you want to write on the screen and the coordinates of it
				this.font.draw(renderer.getContext(), "Awesomenauts", 450, 130);
				//adds second line of text the same way
				this.font.draw(renderer.getContext(), "Press ENTER to play", 250, 530);
			}
		})));

		//new event handler to listen for someone pressing the ENTER button
		this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge){
			//if action equals name of the button made...
			if(action === "start"){
				//start the game
				me.state.change(me.state.PLAY);
			}
		});
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		//unbinds start key so game doesnt start over if ENTER is pressed again
		me.input.unbindKey(me.input.KEY.ENTER); // TODO
		//listen for no button
		me.event.unsubscribe(this.handler);
	}
});
