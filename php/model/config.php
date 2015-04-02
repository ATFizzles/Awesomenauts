<?php
	require_once(__DIR__ . "/database.php");

	//creates session
	session_start();
	//regenerates id of original session
	//prevents hacking
	session_regenerate_id(true);
	//$path holds the string /blog/
	$path = "/AxelTAwesomenauts/php/";

	//database info
	$host = "localhost";
	$username = "root";
	$password = "root";
	$database = "awesomenauts_db";

	//isset determines if a variable has a value
	//if statement checks if session variable has not been set, then will set it to the new database object
	if(!isset($_SESSION{"connection"})){	
		//new object
		$connection = new Database($host, $username, $password, $database);

		//stores connection in _SESSION variable
		$_SESSION{"connection"} = $connection;
	}