//creating MinMap class
game.MinMap = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, "init", [x, y, {
			image: "minmap",
			width: 421,
			height: 76,
			spritewidth: "421",
			spriteheight: "76",
			getShape: function(){
				return (new me.Rect(0, 0, 421, 76)).toPolygon();
			}
		}]);
		this.floating = true;
	}
});