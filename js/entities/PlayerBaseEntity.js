//creates PlayerBase class
//pretty much the same as creating the player class but with a few minor changes
game.PlayerBaseEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			//settings being set (100 instead of 64 for the tower)
			image: "tower",
			width: 100,
			height: 100, 
			spritewidth: "100",
			spriteheight: "100",
			//returns shape of tower
			getShape: function(){
				//makes sure tower is a polygon
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		//says tower has not been destroyed
		this.broken = false;
		//sets health
		this.health = game.data.playerBaseHealth;
		//even if tower is not on screen, the tower will still update
		this.alwaysUpdate = true;
		//if player runs into tower it will be able to collide
		this.body.onCollision = this.onCollision.bind(this);
		//can check and see what you are running into
		this.type = "PlayerBase";

		//renderable helps with animation
		//adds not burning animation
		this.renderable.addAnimation("idle", [0]);
		//adds burning animation
		this.renderable.addAnimation("broken", [1]);
		//sets not burning animation
		this.renderable.setCurrentAnimation("idle");
	},

	//updates what happens on the fly
	update:function(delta){
		//if health is 0, then player is dead
		if(this.health<=0){
			this.broken = true;
			//if my base breaks first...I dont win
			game.data.win = false;
			//sets burning animation
			this.renderable.setCurrentAnimation("broken");
		}
		//delta represents time since last update
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);
		//must always return
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},

	//must have collision function
	onCollision: function(){

	}
});