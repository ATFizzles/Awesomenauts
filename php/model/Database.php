<?php
	class Database{
		//other files cant access private info
		//created instance/global variables that can be accessed in database.php
		//easier to read and maintain code (reusable)
		//the class is creating an object
		private $connection;
		private $host;
		private $username;
		private $password;
		private $database;
		public $error;

		//correct way to define your constructor variables
		//_construct allows you to build an object
		//accepted parameters are passed when the object is created
		public function __construct($host, $username, $password, $database){
			//storing info by assigning info to global variables
			//constructor variables
			$this->host = $host;
			$this->username = $username;
			$this->password = $password;
			$this->database = $database;


			//constructed mysqli object
			//helps connect to server on localhost
			//opens connection
			$this->connection = new mysqli($host, $username, $password, $database);


			if($this->connection->connect_error){
				die("<p>Error: " . $this->connection->connect_error . "</p>");
			}

			//try to acces database to mysqli
			$exists = $this->connection->select_db($database);

			//checks if database is connected to query
			if(!$exists){
				$query = $this->connection->query("CREATE DATABASE $database");

				//if database is created
				if($query){
					echo "<p>successfully created database " . $database . "</p>";
				}
			}

			//if database already exists
			else {
				echo "<p>Database already exists</p>";
			}
		}

		//a function is a block of statements that can be used again and again in a program
		//functions are executed by a call to a function
		//functions get rid of excess repetition
		//opens connection
		//creates new mysqli object
		//checks if there is a conection error
		public function openConnection(){
			$this->connection = new mysqli($this->host, $this->password, $this->username, $this->database);

			//checks for error
			if($this->connection->connect_error) {
				die("<p>Error: " . $this->connection->connect_error . "</p>");
			}

		}
		//closes connectiom
		public function closeConnection(){
			//isset checks if there is something in the variable (if there is info)
			//checks for info in connection variable
			if(isset($this->connection)){
				$this->connection->close();
			}
		}

		//string always passed as a variable
		//takes in string of text and uses string of text to query the database
		public function query($string){
			$this->openConnection();

			//result is stored in $query variable
			//query the database
			$query = $this->connection->query($string);

			//checks if query is not good
			if(!$query){
				$this->error = $this->connection->error;
			}

			$this->closeConnection();

			//returns the results
			return $query;
		}
	}