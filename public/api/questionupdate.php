<?php
session_start();

if(!isset($_SESSION['zalogowany'])) {
    echo 'NIEZALOGOWANY';
    return;
}

require('db.php');



$allowed = ['sentence','answer','question','tags','language','level'];



//replace
$dane = json_decode(file_get_contents('php://input'));

echo 'fasfafdsaf';



$params = [];
$params['id'] = $dane->id;
// $params['token'] = $dane->token;


$setStr = "";
foreach ($allowed as $key) {
    if (property_exists($dane, $key) && $key != "id" && $key != "token") {
        $setStr .= "`" . str_replace("`", "``", $key) . "` = :" . $key . ",";
        $params[$key] = $dane->$key;
    }
}
$setStr = rtrim($setStr, ",");

echo $setStr;
$query = "UPDATE questions SET $setStr WHERE id = :id";
echo $query;
$sth = $dbh->prepare($query)->execute($params);



?>



