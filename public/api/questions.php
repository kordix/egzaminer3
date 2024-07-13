<?php

session_start();

require('db.php');

$query = "select q.id,q.question,q.answer,q.language,q.partofspeech, q.tags, q.rodzajnik, q.fav, q.level, q.counter, q.sentence, ifnull(r.counter,0) as counter , ifnull(r.updated_at,'') as updated_at from questions q
left outer join results r on r.question_id = q.id and r.user_id = ? order by r.counter,q.id asc
";

$sth = $dbh->prepare($query);
$sth->execute([$_SESSION['id']]);

$rows = $sth->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);