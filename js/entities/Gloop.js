//adding new Gloop class
game.Gloop = me.Entity.extend({
	//init function w/ parameters x, y, and settings
	init: function(x, y, settings) {
		//call to super and pass in settings
		this._super(me.Entity, 'init', [x, y, {
			image: "gloop",
			width: 100,
			height: 85,
			spritewidth: "100",
			spriteheight: "85",
			getShape: function(){
				return (new me.Rect(0, 0, 85, 100)).toPolygon();
			}
	}]);
		//sets health of Gloop to playerHealth
		this.health = game.data.playerHealth;
		//always updates
		this.alwaysUpdate = true;
		//this.attcking lets us know if the enemy is currently attacking
		this.attacking = false;
		//keeps track of when our creep last attacked anything
		this.lastAttacking = new Date().getTime();
		//keeps track of the last time our creep hit anything
		this.lastHit = new Date().getTime();
		//timer for enemy attack
		this.now = new Date().getTime();
		//sets movement speed
		this.body.setVelocity(3, 20);
		//sets type of player
		this.type ="gloop";
		//adds walking animation
		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		//sets walk animation
		this.renderable.setCurrentAnimation("walk");	
	},

	//new loseHealth function
	loseHealth: function(damage){
		//subtracts damage from health
		this.health = this.health - damage;
	},

	//delta represents time as a parameter
	update:function(delta){
		//if health is less than or equal to 0...
		if (this.health <= 0) {
			//removes creep from game(basically dies)
			me.game.world.removeChild(this);
		}
		//refreshes every single time
		this.now = new Date().getTime();
		//makes creep spawn and move
		this.body.vel.x += this.body.accel.x * me.timer.tick;
		//flips image
		this.flipX(true);
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
	    var ydif = this.pos.y - response.b.pos.y;
		var xdif = this.pos.x - response.b.pos.x;
		//if gloop is touching enemy base...
		if(response.b.type==='EnemyBase') {
			//...it is attacking base
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to maintain its position
			this.pos.x = this.pos.x - 1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)) {
				//updates the lastHit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function and passes it a
				//game.data.enemyCreepAttack
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
		//if gloop touches enemy creep...
		else if (response.b.type==='EnemyCreep'){
			//sees what x dif is by position of creep - position of player
		 	var xdif = this.pos.x - response.b.pos.x;
		 	var ydif = this.pos.y - response.b.pos.y;
		 	//...it is attacking base
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//position changes only happen if creep is attacking
			if (xdif>0){
				//keeps moving the gloop to the right to maintain its position
				this.pos.x = this.pos.x + 1;
				//this.lastAttacking=this.now;
				this.body.vel.x = 0;
			}
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000) && xdif>0) {
			//updates the lastHit timer
			this.lastHit = this.now;
			//makes the player call its loseHealth function
			//damage of 1
			response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
	}


});