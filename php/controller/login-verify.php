<?php
	require_once(__DIR__ . "/../model/config.php");

	//new function
	function authenticateUser(){
		//checks if $_SESSION is not set
		if(!isset($_SESSION["authenticated"])){
			return false;
		}

		//if it is set
		else{

			//checks if session variable is not true
			if($_SESSION["authenticated"] != true){
				return false;
			}

			else{
				return true;
			}
		}
	}