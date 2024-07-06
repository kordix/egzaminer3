<?php

session_start();

require('db.php');

$query = "select q.*,ifnull(r.counter,0) as counter from questions q
left outer join results r on r.question_id = q.id and r.user_id = ?

";

$sth = $dbh->prepare($query);
$sth->execute([$_SESSION['id']]);

$rows = $sth->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);