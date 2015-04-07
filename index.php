<!DOCTYPE HTML>

<?php
	//requiring create-db.php
	require_once("php/controller/create-db.php");
?>

<html>
	<head>
		<title>melonJS Template</title>
		<link rel="stylesheet" type="text/css" media="screen" href="index.css">
		<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
        <link rel="apple-touch-icon" href="icons/touch-icon-iphone-60x60.png">
        <link rel="apple-touch-icon" sizes="76x76" href="icons/touch-icon-ipad-76x76.png">
        <link rel="apple-touch-icon" sizes="120x120" href="icons/touch-icon-iphone-retina-120x120.png">
        <link rel="apple-touch-icon" sizes="152x152" href="icons/touch-icon-ipad-retina-152x152.png">
        <!--adding jquery files-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
	</head>
	<body>
		<!-- Canvas placeholder -->
		<div id="screen"></div>
		<!-- building a form to hold elements together -->
		<form id="input" method="post"> 
			<!-- field div -->
			<div class="field">
				<!-- username label -->
				<label for="username">Username</label>
				<!-- able to add username in box -->
				<input type="text" name="username" id="username" autocomplete="off">
			</div>

			<!-- div for password -->
			<div class="password">
				<!-- password label -->
				<label for="password">Password</label>
				<!-- able to add password in box -->
				<input type="password" name="password" id="password">
			</div>

			<!-- adding register, load, and mainmenu button -->
			<button type="button" id="register">Register</button>
			<button type="button" id="load">Load</button>
			<button type="button" id="mainmenu">Main Menu</button>

		</form>

		<!-- melonJS Library -->
		<!-- build:js js/app.min.js -->
		<script type="text/javascript" src="lib/melonJS-1.1.0-min.js"></script>

		<!-- Plugin(s) -->
		<script type="text/javascript" src="lib/plugins/debugPanel.js"></script>
		
		<!-- Game Scripts -->
		<script type="text/javascript" src="js/game.js"></script>
		<script type="text/javascript" src="js/resources.js"></script>

		<script type="text/javascript" src="js/entities/entities.js"></script>
		<script type="text/javascript" src="js/entities/EnemyBaseEntity.js"></script>
		<script type="text/javascript" src="js/entities/PlayerBaseEntity.js"></script>
		<script type="text/javascript" src="js/entities/gamemanagers/GameManager.js"></script>
		<script type="text/javascript" src="js/entities/gamemanagers/GameTimerManager.js"></script>
		<script type="text/javascript" src="js/entities/gamemanagers/SpendGold.js"></script>
		<script type="text/javascript" src="js/entities/gamemanagers/HeroDeathManager.js"></script>
		<script type="text/javascript" src="js/entities/EnemyCreep.js"></script>
		<script type="text/javascript" src="js/entities/HUD.js"></script>
		<script type="text/javascript" src="js/entities/SpearThrow.js"></script>
		<script type="text/javascript" src="js/entities/MinMap.js"></script>
		<script type="text/javascript" src="js/entities/MiniPlayerLocation.js"></script>

		<script type="text/javascript" src="js/screens/title.js"></script>
		<script type="text/javascript" src="js/screens/play.js"></script>
		<script type="text/javascript" src="js/screens/spendExp.js"></script>
		<script type="text/javascript" src="js/screens/pause.js"></script>
		<script type="text/javascript" src="js/screens/loadProfile.js"></script>
		<script type="text/javascript" src="js/screens/newProfile.js"></script>
		<!-- /build -->
		<!-- Bootstrap & Mobile optimization tricks -->
		<script type="text/javascript">
			window.onReady(function onReady() {
				game.onload();

				// Mobile browser hacks
				if (me.device.isMobile && !navigator.isCocoonJS) {
					// Prevent the webview from moving on a swipe
					window.document.addEventListener("touchmove", function (e) {
						e.preventDefault();
						window.scroll(0, 0);
						return false;
					}, false);

					// Scroll away mobile GUI
					(function () {
						window.scrollTo(0, 1);
						me.video.onresize(null);
					}).defer();

					me.event.subscribe(me.event.WINDOW_ONRESIZE, function (e) {
						window.scrollTo(0, 1);
					});
				}
			});
		</script>

		<script>
		//when main menu button clicked it starts a function
		$("#mainmenu").bind("click", function(){
			//takes user to menu screen
			me.state.change(me.state.MENU);
		});	
		//when register button clicked...starts a function
		$("#register").bind("click", function(){
			//ajax updates database while program is running
			$.ajax({
				//passes info to create-user file as post
				type: "POST",
				url: "php/controller/create-user.php",
				//passes info value as a variable
				data: {
					username: $('#username').val(),
					password: $('#password').val()
				},
				//type of data is text
				dataType: "text"
			})
				//if it does what its supposed to do...
				.success(function(response){
					//if what we echoed out is true
					if(response==="true"){
						//takes user to play screen
						me.state.change(me.state.PLAY);
					}
					else{
						//echo out something besides true
						alert(response);
					}
			})
				//if it fails...
				.fail(function(response){
					//prints out Fail
					alert("Fail");
				});

		});	

		//when load button clicked...starts a function
		$("#load").bind("click", function(){
			//ajax updates database while program is running
			$.ajax({
				//passes info to login-user file as post
				type: "POST",
				url: "php/controller/login-user.php",
				//passes info value as a variable
				data: {
					username: $('#username').val(),
					password: $('#password').val()
				},
				//type of data is text
				dataType: "text"
			})
				//if it does what its supposed to do...
				.success(function(response){
					//if what we echoed out is "Invalid username and password"
					if(response==="Invalid username and password"){
						//echoes out what wasnt "Invalid username and password"
						alert(response);
					}
					else{
						//creating new data variable using json
						var data = jQuery.parseJSON(response);
						//makes all the exp game variables
						//sets them to what was just loaded
						game.data.exp = data["exp"];
						game.data.exp1 = data["exp1"];
						game.data.exp2 = data["exp2"];
						game.data.exp3 = data["exp3"];
						game.data.exp4 = data["exp4"];
						//takes user to spendexp screen
						me.state.change(me.state.SPENDEXP);
					}
			})
				//if it fails...
				.fail(function(response){
					//prints out Fail
					alert("Fail");
				});

		});	
		</script>
	</body>
</html>
