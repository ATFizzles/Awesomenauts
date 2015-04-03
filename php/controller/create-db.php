<?php
	//connects to index
	require_once(__DIR__ . "/../model/config.php");
	
	//new query variable connected to variable _SESSION, which stores data from connection
	//creating elements of table users
	//new database table to store registered users
	$query = $_SESSION["connection"]->query("CREATE TABLE users ("
		//automatically increments the id # based on previous one
		. "id int(11) NOT NULL AUTO_INCREMENT, "
		//username has to be set
		. "username varchar(30) NOT NULL, "
		//varchar sets max # of characters allowed
		. "email varchar(50) NOT NULL, "
		//all values must be set, hence NOT NULL
		. "password char(128) NOT NULL, "
		. "salt char(128) NOT NULL, "
		//adds exp variables to table
		. "exp int(4),"
		. "exp1 int(4),"
		. "exp2 int(4),"
		. "exp3 int(4),"
		. "exp4 int(4),"
		. "PRIMARY KEY (id))");

	//outputs echo if query was successful
	if($query){
		echo "<p>Successfully created table: users</p>";
	}

	//outputs echo if query was not successful
	//will output the specific error
	else{
		echo "<p>" . $_SESSION["connection"]->error . "</P>";
	}