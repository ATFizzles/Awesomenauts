//creating MinMap class
game.MinMap = me.Entity.extend({
	//new init function passing x, y, and settings
	init: function(x, y, settings){
		this._super(me.Entity, "init", [x, y, {
			//all map dimensions
			image: "minmap",
			width: 421,
			height: 76,
			spritewidth: "421",
			spriteheight: "76",
			//setting shape of map
			getShape: function(){
				return (new me.Rect(0, 0, 421, 76)).toPolygon();
			}
		}]);
		//map follows screen coords, not world coords
		//will always be in the screen
		this.floating = true;
	}
});