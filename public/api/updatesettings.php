<?php
echo 'fasdfdsafds';

session_start();

if(!isset($_SESSION['zalogowany'])) {
    echo 'NIEZALOGOWANY';
    return;
}

require('db.php');


$allowed = ['activelanguage','counterset','sentences','operator','currenttag','tryb','random'];


//replace
$dane = json_decode(file_get_contents('php://input'));

echo 'fasfafdsaf';



$params = [];
// $params['token'] = $dane->token;


$setStr = "";
foreach ($allowed as $key) {
    if (property_exists($dane, $key) && $key != "id" && $key != "token") {
        $setStr .= "`" . str_replace("`", "``", $key) . "` = :" . $key . ",";
        $params[$key] = $dane->$key;
    }   
}
$setStr = rtrim($setStr, ",");



$id = $_SESSION['id'];
echo $setStr;
$query = "UPDATE settings SET $setStr WHERE user_id = $id";
echo $query;
$sth = $dbh->prepare($query)->execute($params);



?>



