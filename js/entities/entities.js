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

		//new player entity
		this.type = "PlayerEntity";
		//sets health of player to playerHealth
		this.health = game.data.playerHealth;
		//sets velocity or movement speed for player
		//changed y movement
		this.body.setVelocity(game.data.playerMoveSpeed, 20);

		//keeps track of which direction your character is going
		this.facing = "right";

		//keeps track of what time it is
		this.now = new Date().getTime();
		//tracks last hit
		this.lastHit = this.now;
		//player is not dead initially
		this.dead = false;

		this.attack = game.data.playerAttack;
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

		//if health ever goes below 0...
		if(this.health <=0){
			//player is dead
			this.dead = true;
		}
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

	//new loseHealth function
	loseHealth: function(damage){
		//if player gets hit...health gets subtracted by amount of damage
		this.health = this.health - damage;
	},

	//holds all info about collision
	collideHandler: function(response){
		//response.b = enemy base entity
		if(response.b.type==='EnemyBaseEntity'){
			//represents dif between player y position and base y position
			var ydif = this.pos.y - response.b.pos.y;
			//represents dif between player x position and base x position
			var xdif = this.pos.x - response.b.pos.x;

			//y difference for landing on the top of the base
			if(ydif<-50 && xdif<70 && xdif>-35){
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
				//this.pos.x = this.pos.x -1;
			}
			//if walking in from right and facing left, stop at certain point/prevents differences from overlapping
			else if(xdif<70 && this.facing==='left' && (xdif>0)){
				//stops player from moving
				this.body.vel.x = 0;
				//slightly moves player backwards
				//this.pos.x = this.pos.x +1;
			}

			//if you are attacking, and in contact with base
			//sets intervals between attacks
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
				//delays hit for a bit
				this.lastHit = this.now;
				//calls loose health function
				//passes game.data.playerAttack (how much damage player deals)
				response.b.loseHealth(game.data.playerAttack);
			}
		}
		//if touching enemy creep...
		else if(response.b.type==='EnemyCreep'){
			//new variables
			var xdif = this.pos.x - response.b.pos.x;
			var ydif = this.pos.y - response.b.pos.y;

			//if xdif is greater than 0...not on far left of screen...
			if(xdif>0){
				//moves player to right 1
				//this.pos.x = this.pos.x + 1;
				//if facing left though
				if(this.facing==="left"){
					//stops player
					this.body.vel.x = 0;
				}
			}

			else{
				//moves player to left 1
				//this.pos.x = this.pos.x - 1;
				//if facing right though
				if(this.facing==="right"){
					//stops player
					this.body.vel.x = 0;
				}
			}

			//if player is attacking and hasn't attacked for the set amount of time...
			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
				//starts absolute value of y difference..no greater than 40
			 && (Math.abs(ydif) <=40) && 
			 //if x difference is greater than 0 and player is facing left...
			 //|| means or
			 //if x difference is less than 0 and player is facing right...
			 //player can only attack creep if it is facing towards it
			 (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))
			 ){
				//makes creep lose health 
				this.lastHit = this.now;

				if(response.b.health <= game.data.playerAttack){
					game.data.gold += 1;
					console.log("Current gold: " + game.data.gold);
				}
				//calls loose health function
				//passes game.data.playerAttack (how much damage player deals)
				response.b.loseHealth(game.data.playerAttack);
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
		this.health = game.data.enemyBaseHealth;
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
		this.health = game.data.enemyCreepHealth;
		//always updates
		this.alwaysUpdate = true;
		//this.attacking lets us know if the enemy is currently attacking
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
		this.type = "EnemyCreep";
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
	update: function(delta){
		//if health is less than or equal to 0...
		if(this.health <= 0){
			//removes creep from game(basically dies)
			me.game.world.removeChild(this);
		}
		//refreshes every single time
		this.now = new Date().getTime();

		var xdif = this.pos.x;
		//creep jumps if x velocity = 0
		//I need to have creep jump if velocity = 0 and hits the certain block
		if(xdif===631 && this.body.vel.x == 0 && !this.body.jumping && !this.body.falling ){
			this.body.jumping = true;
			//moves player upwards
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}
		//actually moves the creep (left)
		this.body.vel.x -= this.body.accel.x * me.timer.tick;

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
		//if creep is touching base...
		if(response.b.type==='PlayerBase'){
			//...it is attacking base
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to maintain its position
			this.pos.x = this.pos.x +1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)){
				//updates the lasthit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function and passes it a
				//game.data.enemyCreepAttack
				response.b.loseHealth(game.data.enemyCreepAttack);
			}
		}
		//if creep touches player...
		else if(response.b.type==='PlayerEntity'){
				//sees what x dif is by position of creep - position of player
				var xdif = this.pos.x - response.b.pos.x;
				//...it is attacking base
				this.attacking=true;
				
				//position changes only happen if creep is attacking
				if(xdif>0){
					//keeps moving the creep to the right to maintain its position
					this.pos.x = this.pos.x +1;
					//this.lastAttacking=this.now;
					this.body.vel.x = 0;
				}
				//checks that it has been at least 1 second since this creep hit something
				//health only lost if creep is attacking
				if((this.now-this.lastHit >= 1000) && xdif>0){
					//updates the lasthit timer
					this.lastHit = this.now;
					//makes the player call its loseHealth function and passes it a
					//game.data.enemyCreepAttack
					response.b.loseHealth(game.data.enemyCreepAttack);
				}
			}
		}
});




//adding new EnemyCreep class
game.Gloop = me.Entity.extend({
	//init function w/ parameters x, y, and settings
	init: function(x, y, settings){
		//call to super and pass in settings
		this._super(me.Entity, 'init', [x, y, {
			image: "gloop",
			width: 32,
			height: 64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		//gives health of 10
		this.health = game.data.gloopHealth;
		//always updates
		this.alwaysUpdate = true;
		//this.attacking lets us know if the enemy is currently attacking
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
		this.type = "Gloop";
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
	update: function(delta){
		//if health is less than or equal to 0...
		if(this.health <= 0){
			//removes creep from game(basically dies)
			me.game.world.removeChild(this);
		}
		//refreshes every single time
		this.now = new Date().getTime();

		//actually moves the creep (left)
		this.body.vel.x -= this.body.accel.x * me.timer.tick;

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
		//if creep is touching base...
		if(response.b.type==='EnemyBase'){
			//...it is attacking base
			this.attacking=true;
			//this.lastAttacking=this.now;
			this.body.vel.x = 0;
			//keeps moving the creep to the right to maintain its position
			this.pos.x = this.pos.x +1;
			//checks that it has been at least 1 second since this creep hit a base
			if((this.now-this.lastHit >= 1000)){
				//updates the lasthit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function and passes it a
				//game.data.enemyCreepAttack
				response.b.loseHealth(game.data.gloopAttack);
			}
		}
		//if creep touches player...
		else if(response.b.type==='PlayerEntity'){
				//sees what x dif is by position of creep - position of player
				var xdif = this.pos.x - response.b.pos.x;
				//...it is attacking base
				this.attacking=true;
				
				//position changes only happen if creep is attacking
				if(xdif>0){
					//keeps moving the creep to the right to maintain its position
					this.pos.x = this.pos.x +1;
					//this.lastAttacking=this.now;
					this.body.vel.x = 0;
				}
				//checks that it has been at least 1 second since this creep hit something
				//health only lost if creep is attacking
				if((this.now-this.lastHit >= 1000) && xdif>0){
					//updates the lasthit timer
					this.lastHit = this.now;
					//makes the player call its loseHealth function and passes it a
					//game.data.enemyCreepAttack
					response.b.loseHealth(game.data.gloopAttack);
				}
			}
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
		this.paused = false;
		//keeps program updating
		this.alwaysUpdate = true;
	},
	//updates at the end
	update: function(){
		//keeps track of timer
		this.now = new Date().getTime();

		//if player dies...
		if(game.data.player.dead){
			//removes character from the map
			me.game.world.removeChild(game.data.player);
			//respawns player at (10, 0)
			me.state.current().resetPlayer(10, 0);
		}


		//keeps track of if it needs to make a new creep
		//rounds to 10 on one second interval
		//makes sure creeps dont spawn within a second
		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
			game.data.gold += 1;
			console.log("Current gold: " + game.data.gold);
		}


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

	