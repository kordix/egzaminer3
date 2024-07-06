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


        <div class="container" style="padding-top:5px">

            <div style="width:400px">
                <p v-if="emptyprompt"><b>Skończyły się słówka! Zmień counterset albo dodaj nowe</b></p>
                <div style="display:flex;justify-content:space-between;width:400px">
                    <span style="font-size:12px">Counter: {{currentQuestion?.counter}}</span>
                    <span style="font-size:10px">id: {{currentQuestion?.id}}</span>
                </div>
                <p style="margin-top:4px"><b>Przetłumacz:</b> {{currentQuestion?.question}} </p>

                <input type="text" @keyup.enter.stop="handleAnswer" v-model="answer" class="form-control mb-2"
                    id="answerinput">

                <button @click="handleAnswer" class="btn btn-primary mt-1" style="transition:1s"
                    :class="{'disabledcursor': answerTrue || answerFalse}"
                    :disabled="answerTrue || answerFalse">Answer</button>
                <button @click="next" class="btn btn-success" style="margin-left:1em" id="nextbutton">Next</button>

                <p v-if="answerFalse"><b style="color:red">ŹLE! </b> <span style="font-size:14px">Prawidłowa
                        odpowiedź:</span> {{currentQuestion?.answer}}</p>
                <p v-if="answerTrue"><b style="color:green">DOBRZE! </b>Prawidłowa odpowiedź:
                    {{currentQuestion?.answer}}</p>




                <hr>

                <p>Counterset:
                    <select name="" id="" v-model="settings.operator" @change="updateSettings">
                        <option value="<"><</option>
                        <option value=">">></option>


                    </select>
                    <select name="" id="" v-model="settings.counterset" @change="updateSettings">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </p>

            </div>
        </div>

    </div>




    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.2/axios.min.js"></script>
    <script src="script.js">

    </script>
</body>

</html>