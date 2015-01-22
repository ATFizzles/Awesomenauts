//creating basic player class
game.PlayerEntity = me.Entity.extend({
	//init is constructor function with 3 parameters
	init: function(x, y, settings){
		//reaches to the constructor of entity
		//passes settings through []s
		this._super(me.Entity, 'init', [x, y, {
			//all the settings are being set
			image: "player",
			width: 64, 
			height: 64, 
			spritewidth: "64",
			spriteheight: "64",
			//returns shape of player in box
			getShape: function(){
				//.toPolygon turns shape into a polygon
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		//sets velocity or movement speed for player
		this.body.setVelocity(5, 20);

	},
	//what happens on the fly
	update: function(delta){
		//checks if right key was pressed
		if(me.input.isKeyPressed("right")){
			//adds to the position of my x by the velocity defined above in setVelocity()
			//and multiplying it by me.timer.tick
			//me.timer.tick makes movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		//if right is not clicked, dont move
		else{
			this.body.vel.x = 0;
		}

		//tells all the code to actually work
		//delta is change in time that happened
		//must always update for screen to run
		this.body.update(delta);
		return true;
	}
});