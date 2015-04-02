<?php
	require_once(__DIR__ . "/../model/config.php");

	//unsets session variable and logs out user
	//basically deletes variable
	unset($_SESSION["authenticated"]);

	//completely ends session
	session_destroy();

	//redirects user back to index.php
	header("Location: " . $path . "index.php");