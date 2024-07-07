<?php

?><?php

session_start();

require('db.php');

$id = $_GET['id'];

$counter = $_GET['counter'];


$querycheck = "select  * from results where question_id = ? and user_id = ?";
$sth = $dbh->prepare($querycheck);
$sth->execute([$id, $_SESSION['id']]);

$rows = $sth->fetchAll(PDO::FETCH_ASSOC);


if(count($rows) > 0){

    $query = "update results set counter = ? where question_id = ? and user_id = ?";
    $sth2 = $dbh->prepare($query);
    $sth2->execute([$counter, $id, $_SESSION['id']]);

} else{

    $query = "INSERT INTO results (question_id, user_id , counter) VALUES (?,?,?)";
    $sth2 = $dbh->prepare($query);
    $sth2->execute([$id, $_SESSION['id'],$counter ]);

    
}


echo $query;

