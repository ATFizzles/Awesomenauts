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
	},
	//what happens on the fly
	update: function(){

	}
});