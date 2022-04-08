<?php

//https://polinetworklink.altervista.org/code.php?mode=code&code=XXXXXXX

$mode = $_REQUEST["mode"];

if (!($mode == "code")) {
	echo "Mode parameter not allowed!";
	return;
}	

$code = $_REQUEST["code"];
if (!$code) {
	echo "No code parameter!";
	return;
}
$host = "localhost";
$username = "root";
$password = "";

$db_name = "my_polinetworklink";

$conn = mysqli_connect($host, $username, $password, $db_name);


if (!$conn) {
	echo "Connection failed!";
	return;
}

$sql = "SELECT * FROM Codes WHERE Code=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();


$n = mysqli_num_rows($result);
$r = [];
if ($n > 0) {
	for ($i = 0; $i < $n; $i++) {
		$row = mysqli_fetch_assoc($result);
		array_push($r, $row);
	}
}

$json_string = json_encode($r, JSON_PRETTY_PRINT);
print_r($json_string);

?>