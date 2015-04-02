<?php
	//connects to index
	require_once(__DIR__ . "/../model/config.php");
	
	//query creates table
	//table name is postsR
	//no values can be null
	//table holds id string and posts text
	$query = $_SESSION{"connection"}->query("CREATE TABLE posts ("
		//creating table elements and setting max character limits + NOT NULL to make sure all info is inputted
		. "id int(11) NOT NULL AUTO_INCREMENT,"
		. "title varchar(255) NOT NULL,"
		. "post text NOT NULL,"
		. "DateTime datetime NOT NULL,"
		. "PRIMARY KEY (id))");

	//checks if query was successfully applied or run in the database
	//<p> and </p> are html tags within php
	if($query){
		echo "<p>Successfully created table: posts</p>";
	}

	//creating new session to open connection_aborted(oid)
	//_SESSION stores database info from "connection"
	else {
		echo "<p>" . $_SESSION{"connection"}->error . "</p>";
	}

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