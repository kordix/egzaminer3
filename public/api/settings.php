<?php

session_start();

require('db.php');

$query = "select * from settings where user_id = ?"

;

$sth = $dbh->prepare($query);
$sth->execute([$_SESSION['id']]);

$rows = $sth->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows[0]);
