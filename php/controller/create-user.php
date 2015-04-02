<?php
	//gives access to database object within config.php
	require_once(__DIR__ . "/../model/config.php");
	//gets 3 inputs from form
	//storing them in variable
	//getting info via post method
	//name of input that is being applied
	//deletes characters that cant exist in emails
	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

	//new salt variable
	//registers unique salt for users crypted info
	//tells program to uses shaw256 5000 times
	//$5$ starts salt function
	//uses huge random number to create really unique id
	$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";

	//new hashedPassword variable that stores the crypt version of the original password
	$hashedPassword = crypt($password, $salt);

	//creating new query
	//setting info in table
	//inserts info into table users
	$query = $_SESSION["connection"]->query("INSERT INTO users SET "
		. "email = '$email', "
		. "username = '$username', "
		. "password = '$hashedPassword', "
		. "salt = '$salt', "
		. "exp = 0, "
		. "exp1 = 0, "
		. "exp2 = 0, "
		. "exp3 = 0, "
		. "exp4 = 0");

	$_SESSION["name"] = $username;

	if($query){

		echo "true";
	}

	else{
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}