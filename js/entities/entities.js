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
		//changed y movement
		this.body.setVelocity(5, 20);

		//screen follows wherever player goes on x and y axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		//adding "idle animation"
		this.renderable.addAnimation("idle", [78]);
		//adding "walk" animation and setting images to use
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);

		//sets an animation to start with (default)
		this.renderable.setCurrentAnimation("idle");
	},
	//what happens on the fly
	update: function(delta){
		//checks if right key was pressed
		if(me.input.isKeyPressed("right")){
			//adds to the position of my x by the velocity defined above in setVelocity()
			//and multiplying it by me.timer.tick
			//me.timer.tick makes movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//flips animation position 180 degrees
			this.flipX(true);
		}
		//if right is not clicked, dont move
		else{
			this.body.vel.x = 0;
		}

		//walk animation only if character is moving
		if(this.body.vel.x !== 0){
		//doesnt start walk animation if it is already walking
		if(!this.renderable.isCurrentAnimation("walk")){
			this.renderable.setCurrentAnimation("walk");
		}
	}
		//if velocity is 0 set to idle
		else{
			this.renderable.setCurrentAnimation("idle");
		}



		//tells all the code to actually work
		//delta is change in time that happened
		//must always update for screen to run
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);
		return true;
	}
});

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
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
			}
		}]);
		//says tower has not been destroyed
		this.broken = false;
		//sets health
		this.health = 10;
		//even if tower is not on screen, the tower will still update
		this.alwaysUpdate = true;
		//if player runs into tower it will be able to collide
		this.body.onCollision = this.onCollision.bind(this);
		//can check and see what you are running into
		this.type = "PlayerBaseEntity";

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

	//must have collision function
	onCollision: function(){

	}
});


//just like PlayerBaseEntity class, but the name is EnemyBaseEntity
//everything is the same
game.EnemyBaseEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100, 
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 100)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";

		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function(){
		
	}
});