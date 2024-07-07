CREATE TEMPORARY TABLE temp_table AS
SELECT MIN(id) AS id
FROM questions
GROUP BY answer;

DELETE FROM questions
WHERE id NOT IN (SELECT id FROM temp_table);

DROP TEMPORARY TABLE temp_table;
