//creating MinMap class
game.MiniPlayerLocation = me.Entity.extend({
	//new init function passing x, y, and settings
	init: function(x, y, settings){
		//adding settings
		this.settings = settings;
		//r value is radius of circle
		this.r = 5;
		//diameter is radius times 2 plus 2
		this.diameter = (this.r+2)*2;
		//keeps track of where circle goes
		this.anchorPoint = new me.Vector2d(0, 0);
		//sets location of circle
		this.loc = x, y;
		//setting up dimensions...
		this.settings.width = this.diameter;
		this.settings.height = this.diameter;
		this.settings.spritewidth = this.diameter;
		this.settings = this.diameter;
		//follows screen not world
		this.floating = true;
		//making canvas
		this.image = me.video.createCanvas(this.settings.width, this.settings.height);
		//context variable to make image on canvas
		var ctx = me.video.renderer.getContext2d(this.image);

		//setting color and opacity
		ctx.fillStyle = "rgba(0, 192, 32, 0.75)";
		//setting line around circle color
		ctx.strokeStyle = "blue";
		//line width
		ctx.lineWidth = 2;

		//using math to draw circle
		//setting height and width, actual radius, and draws arc we want
		ctx.arc(this.r + 2, this.r + 2, this.r, 0, Math.PI*2);
		//fills circle
		ctx.fill();
		//draws line around circle
		ctx.stroke();

		//new my variable
		var my = this;
		//calling to super...
		this._super(me.Entity, "init", [x, y, {
			//sets dimensions of circle
			width: 14,
			height: 14,
			spriteWidth: "14",
			spriteHeight: "14",
			getShape: function(){
				return(new me.Rect(0, 0, 14, 14)).toPolygon();
			} 
		}]);
	},

	//draw function passes renderer
	draw: function(renderer){
		//calls to super...
		this._super(me.Entity, "draw", [renderer]);
		//follows screen, not world
		this.floating = true;
		//actually draws image using the renderer
		renderer.drawImage(
				this.image,
				0, 0, this.width, this.height,
				this.pos.x, this.pos.y, this.width, this.height
			);
	},

	//update function
	update: function(){
		//resets position of circle so that it follows player
		this.pos.x = (10 + (game.data.player.pos.x * 0.12));
		this.pos.y = (10 + (game.data.player.pos.y * 0.12));
		return true;
	}

});