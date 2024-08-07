<?php



session_start();

if(!isset($_SESSION['zalogowany'])) {
    echo 'NIEZALOGOWANY';
    return;
}




require('db.php');

$id = $_GET['id'];

$query = "delete from questions where id = ?";
$sth = $dbh->prepare($query);
$sth->execute([$id]);


$query = "delete from results where question_id = ?";
$sth = $dbh->prepare($query);
$sth->execute([$id]);



?>
