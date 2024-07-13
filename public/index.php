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

    <link rel="icon" href="data:;base64,=">


    <link rel="stylesheet" href="css/mybootstrap.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css">


</head>

<body>

    <div id="app" v-cloak>



        <?php
            require('navbar.php');
?>


        <div class="container" style="padding-top:5px">

            <div style="width:400px">
                <p v-if="emptyprompt || !questions.length"><b>Skończyły się słówka! Zmień counterset albo dodaj nowe</b></p>
                <div style="display:flex;justify-content:space-between;width:400px">
                    <span style="font-size:12px">Counter: {{currentQuestion?.counter}}</span>
                    <span style="font-size:10px">id: {{currentQuestion?.id}}</span>
                </div>
                <p style="margin-top:4px"><b>Przetłumacz:</b> <span v-if="settings.tryb=='POLDE'">{{currentQuestion?.question}} </span> <span v-if="settings.tryb=='DEPOL'">{{currentQuestion?.answer}} </span>  </p>

                <input type="text" @keyup.enter.stop="handleAnswer" v-model="answer" class="form-control mb-2"
                    id="answerinput" autocomplete="off">

                <button @click="handleAnswer" class="btn btn-primary mt-1" style="transition:1s"
                    :class="{'disabledcursor': answerTrue || answerFalse}"
                    :disabled="answerTrue || answerFalse">Answer</button>
                <button @click="next" class="btn btn-success" style="margin-left:1em" id="nextbutton">Next</button>
                <button @click="prev" class="btn btn-secondary" style="margin-left:1em" id="nextbutton">Prev</button>

                <br>
                <div style="display:flex;justify-content:space-between">
                    <div>
                        <button class="btn btn-success btn-sm" style="margin:2px" @click="setCounter(1)">+1</button>
                        <button class="btn btn-success btn-sm" @click="setCounter(5)">+5</button>
                    </div>

                    <button class="btn btn-sm btn-warning" @click="editmode = !editmode"><i class="bi bi-pen"></i></button>

                </div>

                <div class="mt-1" id="refericons"> 

                <a :href="'https://es.wiktionary.org/wiki/'+currentQuestion.answer" target="_blank">
                    <img src="https://upload.wikimedia.org/wikipedia/meta/6/61/Wiktionary_propsed-smurrayinchester.png" alt="" style="width:30px;height:30px;transition:0.5" class="opacityhover">
                </a>

                </div>

                <div v-if="editmode">
                    <div class="mb-2 mt-2">
                        <label for="" style="width:80px;display:inline-block">Pytanie (pol):</label><input type="text" v-model="currentQuestion.question" autocomplete="off">
                    </div>
                    <div class="mb-2">
                        <label for="" style="width:80px;display:inline-block">Odpowiedź (obcy):</label><input type="text" v-model="currentQuestion.answer" autocomplete="off">
                    </div>

                    <div class="mb-2">
                        <label for="" style="width:80px;display:inline-block">Tematyka:</label><input type="text" v-model="currentQuestion.tags" autocomplete="off">
                    </div>

                    <div class="mb-2">
                    <label for="">Poziom:</label> 
                    <select name="" id="" v-model="currentQuestion.level">
                        <option value="basic">Podstawowe</option>
                        <option value="advanced">Zaawansowane</option>

                    </select>
                    </div>
                

                    <button class="btn btn-primary mr-1" @click="updateQuestion"><i class="bi bi-floppy"></i></button>
                    <button class="btn btn-secondary" @click="exchange"><i class="bi bi-arrow-clockwise"></i></button>

                    <p v-if="updateprompt"><b>Zapisano zmiany!</b></p>



                </div>



                <p v-if="answerFalse"><b style="color:red">ŹLE! </b> 
                    <span style="font-size:14px">Prawidłowa odpowiedź:</span> <span v-if="settings.tryb=='DEPOL'">{{currentQuestion?.question}} </span> <span v-if="settings.tryb=='POLDE'">{{currentQuestion?.answer}} </span> 
                </p>
                <p v-if="answerTrue"><b style="color:green">DOBRZE! </b>
                                    <span style="font-size:14px">Prawidłowa odpowiedź:</span> <span v-if="settings.tryb=='DEPOL'">{{currentQuestion?.question}} </span> <span v-if="settings.tryb=='POLDE'">{{currentQuestion?.answer}} </span> </p>
                </p>




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

                <p>
                    Tryb:
                    <select name="" id="" v-model="settings.tryb" @change="updateSettings">
                        <option value="POLDE">Polski - obcy</option>
                        <option value="DEPOL">Obcy - polski</option>
                    </select>
                </p>

                <p>
                    Tematyka:

                    <select name="" id="" @change="updateSettings" v-model="settings.currenttag">
                        <option value="">wszystkie</option>
                        <option :value="tag" v-for="tag in tags">{{tag}}  {{questions.filter((el)=>el.tags == tag)?.filter((el)=>el.counter < settings.counterset)?.length}} / {{questions.filter((el)=>el.tags == tag).length}}  </option>
                    </select>
                </p>

                <p>
                    Level:

                     <select name="" id="" v-model="settings.level" @change="updateSettings">
                        <option value="">wszystkie</option>
                        <option value="basic">Podstawowe</option>
                        <option value="advanced">Zaawansowane</option>
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