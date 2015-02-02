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

		//keeps track of which direction your character is going
		this.facing = "right";

		//keeps track of what time it is
		this.now = new Date().getTime();
		//tracks last hit
		this.lastHit = this.now;
		//creates hit delay
		this.lastAttack = new Date().getTime(); //Havent used attack variable yet

		//screen follows wherever player goes on x and y axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		//adding "idle animation"
		this.renderable.addAnimation("idle", [78]);
		//adding "walk" animation and setting images to use
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		//adding "attack" animation
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		//sets an animation to start with (default)
		this.renderable.setCurrentAnimation("idle");
	},
	//what happens on the fly
	update: function(delta){
		//updates this.now(keeps timer up to date)
		this.now = new Date().getTime();
		//checks if right key was pressed
		if(me.input.isKeyPressed("right")){
			//adds to the position of my x by the velocity defined above in setVelocity()
			//and multiplying it by me.timer.tick
			//me.timer.tick makes movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//makes character face right
			this.facing = "right";
			//flips animation position 180 degrees
			this.flipX(true);
		}
		//checks if left key was pressed
		else if(me.input.isKeyPressed("left")){
			//moves player left
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			//makes character face left	
			this.facing = "left";
			//false b/c dont want player to look like he is walking right
			this.flipX(false);
		}
		//if right is not clicked, dont move
		else{
			this.body.vel.x = 0;
		}
		//checks if space bar was pressed/cant jump while in air
		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
			this.body.jumping = true;
			//moves player upwards
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}

		//if attack key is pressed...
		if(me.input.isKeyPressed("attack")){
			//if current animation isnt attack then sets current animation to attack then idle
			if(!this.renderable.isCurrentAnimation("attack")){
				//sets the current animation to attack and once that is over
				//goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence we begin
				//from the first animation, not wherever we left off when we
				//switched to another animation
				this.renderable.setAnimationFrame();
			}
		}

		//walk animation only if character is moving
		//only if there is no current attack animation
		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			//doesnt start walk animation if it is already walking
			if(!this.renderable.isCurrentAnimation("walk")){
			this.renderable.setCurrentAnimation("walk");
			}
		}
		//if velocity is 0 set to idle
		//set to idle if not currently attacking
		else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}

		//checks for collisions/passes function into collideHandler
		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//tells all the code to actually work
		//delta is change in time that happened
		//must always update for screen to run
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	//holds all info about collision
	collideHandler: function(response){
		//response.b = enemy base entity
		if(response.b.type==='EnemyBaseEntity'){
			//represents dif between player y position and base y position
			var ydif = this.pos.y - response.b.pos.y;
			//represents dif between player x position and base x position
			var xdif = this.pos.x - response.b.pos.x

			//y difference for landing on the top of the base
			if(ydif<-40 && xdif<70 && xdif>-35){
				//cant fall through base
				this.body.falling = false;
				//slightly moves player down once stopped
				this.body.vel.y = -1;
			}
			//if walking in from left and facing right, stop at certain point/prevents differences from overlapping
			else if(xdif>-35 && this.facing==='right' && (xdif<0)) {
				//stops player from moving
				this.body.vel.x = 0;
				//slightly moves player backwards
				this.pos.x = this.pos.x -1;
			}
			//if walking in from right and facing left, stop at certain point/prevents differences from overlapping
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				//stops player from moving
				this.body.vel.x = 0;
				//slightly moves player backwards
				this.pos.x = this.pos.x +1;
			}

			//if you are attacking, and in contact with base
			//makes sure health is greater than 1000 milliseconds
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
				//delays hit for a bit
				this.lastHit = this.now;
				//calls loose health function
				response.b.loseHealth();
			}
		}
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
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
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
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
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
		
	},

	//new health function
	loseHealth: function(){
		//makes health go down by 1
		this.health--;
	}
});

//adding new EnemyCreep class
game.EnemyCreep = me.Entity.extend({
	//init function w/ parameters x, y, and settings
	init: function(x, y, settings){
		//call to super and pass in settings
		this._super(me.Entity, 'init', [x, y, {
			image: "creep1",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		//gives health of 10
		this.health = 10;
		//always updates
		this.alwaysUpdate = true;
		//sets movement speed
		this.body.setVelocity(3, 20);
		//sets type of player
		this.type = "EnemyCreep";
		//adds walking animation
		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		//sets walk animation
		this.renderable.setCurrentAnimation("walk");
	},

	//delta represents time as a parameter
	update: function(delta){
		
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		//updates time
		this.body.update(delta);

		//updates animation on the fly
		this._super(me.Entity, "update", [delta]);

		return true;
	}
});

//whole class that manages timers
//not an entity, just an object
game.GameManager = Object.extend({
	//uses same functions as usual
	//constructor function
	init: function(x, y, settings){
		//setting key variables
		this.now = new Date().getTime();
		//keeps track of the last creep that spawned
		this.lastCreep = new Date().getTime();
		//keeps program updating
		this.alwaysUpdate = true;
	},
	//updates at the end
	update: function(){
		//keeps track of timer
		this.now = new Date().getTime();

		//keeps track of if it needs to make a new creep
		//rounds to 10 on one second interval
		//makes sure creeps dont spawn within a second
		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
			//updates timer to this.now
			this.lastCreep = this.now;
			//builds creep
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			//adds creep into the world
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
});