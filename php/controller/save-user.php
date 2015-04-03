<?php

//magic directory to config file
//makes file accessible
require_once(__DIR__ . "/../model/config.php");

//creating all exp variables
//gets input from post
//filtering by sanitizing the string
$exp = filter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);
$exp1 = filter_input(INPUT_POST, "exp1", FILTER_SANITIZE_STRING);
$exp2 = filter_input(INPUT_POST, "exp2", FILTER_SANITIZE_STRING);
$exp3 = filter_input(INPUT_POST, "exp3", FILTER_SANITIZE_STRING);
$exp4 = filter_input(INPUT_POST, "exp4", FILTER_SANITIZE_STRING);


//sticks code variables into database
//updates users
//stores exp variables to what the name of database is
$query = $_SESSION["connection"]->query("UPDATE users SET "
		//dots concatinate
		. "exp = $exp, "
		. "exp1 = $exp1, "
		. "exp2 = $exp2, "
		. "exp3 = $exp3, "
		//tells where to add database
		. "exp4 = $exp4 WHERE username = \"" . $_SESSION["name"]. "\"");

//if it works...
if($query){
	//prints out true
	echo "true";
}
else{
	//else prints out error
	echo "<p>" . $_SESSION["connection"]->error . "</p>";
}