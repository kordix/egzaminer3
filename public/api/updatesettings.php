<?php
session_start();
//if($_SERVER['REQUEST_METHOD'] != 'POST') return;

require_once('db.php');

//replace
$dane = json_decode(file_get_contents('php://input'));

//$id = $dane->id;

$kwerenda = '';

foreach ($dane as $key => $value) {
    $kwerenda .= $key;
    $kwerenda .= '=';
    $kwerenda .= "'".$value."'";
    $kwerenda .= ',';
}

$kwerenda = substr($kwerenda, 0, -1);
$query = "UPDATE settings SET $kwerenda WHERE user_id = ?";
echo $query;

$sth = $dbh->prepare($query);

if ($sth->execute([$_SESSION['id']]) == false) {
    echo 'nie udało się';
}




//replace

?>



