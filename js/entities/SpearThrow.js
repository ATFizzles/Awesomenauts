//creating SpearThrow class
game.SpearThrow = me.Entity.extend({
	init: function(x, y, settings, facing){
		//call to super and pass in settings
		this._super(me.Entity, 'init', [x, y, {
			image: "spear",
			width: 48,
			height: 48,
			spritewidth: "48",
			spriteheight: "48",
			getShape: function(){
				return (new me.Rect(0, 0, 48, 48)).toPolygon();
			}
		}]);
		//always updates
		this.alwaysUpdate = true;
		//sets movement speed
		this.body.setVelocity(8, 0);
		//sets ability 3 as an attack
		this.attack = game.data.ability3*3;
		//sets type of player
		this.type = "spear";
		//tracks direction player is facing
		this.facing = facing;
	},

	update: function(delta){
		//if player facing left
		if(this.facing === "left"){
			//actually moves the spear (left)
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}
		else{
			//actually moves the spear (right)
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}
		//checks for collisions 
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//updates time
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);

		return true;
	},

	//new collideHandler function
	collideHandler: function(response){
		//if spear hits creep or enemy base...
		if(response.b.type==='EnemyBase' || response.b.type==='EnemyCreep'){
			//makes the enemy base and creep call its loseHealth function and passes it a
			//game.data.enemyCreepAttack
			response.b.loseHealth(this.attack);
			me.game.world.removeChild(this);
		}
	}
});