<?php

session_start();

if(!isset($_SESSION['zalogowany'])) {
    header('location:/logowanie.php');
}


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egzaminer 3</title>


    <link rel="stylesheet" href="css/mybootstrap.css">
    <link rel="stylesheet" href="css/style.css">


</head>

<body>

    <div id="app" v-cloak>



        <?php
            require('navbar.php');

        ?>

        <div class="container">
        
        <p>Dodaj słówko:</p>

        <p><span style="display:inline-block;width:100px">Po polsku:</span> <input type="text" v-model="formadd.question"></p>

        <p><span style="display:inline-block;width:100px">Tłumaczenie:</span> <input type="text" v-model="formadd.answer"></p>

        <p><span style="display:inline-block;width:30px" >Tagi:</span> <input type="text" v-model="formadd.tags"></p>


        <button class="btn btn-primary" :class="{'disabledcursor':!formadd.question || !formadd.answer}" :disabled="!formadd.question || !formadd.answer" @click="questionAdd">Zapisz</button>
           

        <hr>
        <table>
            <thead style="font-weight:bold">
                <tr style="cursor:pointer">
                    <td @click="sortuj('question')">Słowo</td>
                    <td @click="sortuj('answer')">Tłumaczenie</td>
                    <td @click="sortuj('counter')">Counter</td>
                    <td @click="sortuj('tags')">Tag</td>
                    <td  @click="sortuj('updated_at')">Ostatnia akcja</td>
                </tr>
            </thead>
            <tbody>
                 <tr v-for="elem in filtered">
                    <td>{{elem.question}}</td>
                    <td>{{elem.answer}}</td> 
                    <td>{{elem.counter}}</td>
                    <td>{{elem.tags}}</td> 
                    <td>{{elem.updated_at}}</td> 

                </tr>
            </tbody>
        </table>
        </div>

    </div>


     <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.2/axios.min.js"></script>

    <script src="scriptlist.js"></script>


</body>

