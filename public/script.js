String.prototype.escapeDiacritics = function () {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
        .replace(/ü/g, 'u').replace(/ú/g, 'u')
        .replace(/ö/g, 'o').replace(/é/g, 'e')
        .replace(/ä/g, 'a').replace(/í/g, 'i')
        .replace(/á/g, 'a').replace(/ö/g, 'o')
        .replace(/ß/g, 'ss')
        .replace(/ñ/g, 'n')
        ;
}

function distinctValues(arr, prop) {
    const seen = new Set();
    return arr.map(item => item[prop]).filter(value => {
        if (seen.has(value)) {
            return false;
        } else {
            seen.add(value);
            return true;
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


let speech = new SpeechSynthesisUtterance();

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();

    console.log(voices);

    console.log(voices);

    speech.voice = voices[16];
};


let app = Vue.createApp({
    data() {
        return {
            dupa: 'afsadfs',
            questions: [],
            questionsFiltered: [],

            currentQuestion: {},
            answer: '',
            answerTrue: false,
            answerFalse: false,
            settings: {
                random:false
            },
            emptyprompt: false,
            tags:[],
            editmode:false,
            updateprompt:false

        }
    },
    methods: {
        async getData() {
            let self = this;
            await axios.get('api/questions.php').then((res) => self.questions = res.data);


            this.questions = this.questions.filter((el) => el.language == self.settings.activelanguage);
            this.questionsFiltered = this.questions;

            if(this.settings.currenttag){
                this.questionsFiltered = this.questionsFiltered.filter((el) => el.tags == self.settings.currenttag);

            }

            if (this.settings.operator == '<') {
                this.questionsFiltered = this.questionsFiltered.filter((el) => el.counter < self.settings.counterset);
            }

            if (this.settings.operator == '>') {
                this.questionsFiltered = this.questionsFiltered.filter((el) => el.counter >= self.settings.counterset);
            }

            if(this.settings.level){
                this.questionsFiltered = this.questionsFiltered.filter((el) => el.level == self.settings.level);

            }

            if(this.settings.random){
                this.questionsFiltered = shuffleArray(this.questionsFiltered);
            }

            if(this.settings.sentences){
                this.questionsFiltered = this.questionsFiltered.filter((el)=>el.sentence)
            }


            this.currentQuestion = this.questionsFiltered.find((el) => el.language = self.settings.activelanguage);

            this.tags = distinctValues(this.questions, 'tags');




        },
        next() {
            this.updateprompt = false;
            let self = this;
            let currentQuestionIndex = this.questionsFiltered.findIndex((el)=>el.id == self.currentQuestion.id);
            this.currentQuestion = this.questionsFiltered[currentQuestionIndex + 1];
            if (!this.currentQuestion) {
                this.currentQuestion = this.questionsFiltered.find((el) => el.language = self.settings.activelanguage);


                if (!this.currentQuestion || this.questionsFiltered.length == 1) {
                    this.emptyprompt = true;
                    return;
                }
            }

            this.answerTrue = false;
            this.answerFalse = false;

            this.answer = '';

            setTimeout(function () {
                document.querySelector('#answerinput').focus()

                if(self.settings.tryb == 'DEPOLHEAR'){
                    self.speak()
                }
            }, 150)

        },
        prev() {
            self = this;

            let currentQuestionIndex = this.questionsFiltered.findIndex((el) => el.id == self.currentQuestion.id);
            this.currentQuestion = this.questionsFiltered[currentQuestionIndex - 1];

            if (!this.currentQuestion) {
                console.log('NIE WIDZI');
                this.currentQuestion = this.questionsFiltered[this.questionsFiltered.length - 1];

                if (!this.currentQuestion || this.questionsFiltered.length == 1) {
                    this.emptyprompt = true;
                    return;
                }
            }

            this.answerTrue = false;
            this.answerFalse = false;

            this.answer = '';

            setTimeout(function () {
                document.querySelector('#answerinput').focus()
            }, 150)

        },
        getQuestion() {
            let self = this;
        },
        handleAnswer() {
            if (this.answerTrue || this.answerFalse) {
                return
            }
            let answerTrue = false;

            if (this.settings.tryb == 'POLDE') {
                if (this.answer.escapeDiacritics().toLowerCase() == this.currentQuestion?.answer.escapeDiacritics().toLowerCase()) {
                    answerTrue = true;
                }
            }

            if (this.settings.tryb == 'DEPOL' || this.settings.tryb == 'DEPOLHEAR') {
                if (this.answer.escapeDiacritics().toLowerCase() == this.currentQuestion?.question.escapeDiacritics().toLowerCase()) {
                    answerTrue = true;
                }
            }

            if (answerTrue) {
                this.answerTrue = true;
                this.answerFalse = false;

                this.currentQuestion.counter += 1;

                axios.get(`/api/updatecounter.php?id=${this.currentQuestion.id}&counter=${this.currentQuestion.counter}`)
            } else {
                this.answerTrue = false;
                this.answerFalse = true;
            }

            document.querySelector('#nextbutton').focus()

        },
        setCounter(ile){
            this.currentQuestion.counter += ile;
            axios.get(`/api/updatecounter.php?id=${this.currentQuestion.id}&counter=${this.currentQuestion.counter}`);
            this.next();
        },
        updateSettings() {
            let form = { ...this.settings };
            if(form.random){
                form.random = 1;
            } else {
                form.random = 0;
            }
            axios.post('/api/updatesettings.php', form).then((res) => location.reload())
        },
        updateQuestion(){
            axios.post('/api/questionupdate.php',this.currentQuestion);
            this.updateprompt = true;
        },
        exchange(){
            let questiontemp = this.currentQuestion.question;
            let answertemp = this.currentQuestion.answer;

            this.currentQuestion.question = answertemp;
            this.currentQuestion.answer = questiontemp;
        },
        speak(){
            speech.text = this.currentQuestion.answer;
            // speech.text = 'бежать';
            window.speechSynthesis.speak(speech);
        }

    },
    async mounted() {
        let self = this;
        await axios.get('api/settings.php').then((res) => self.settings = res.data)
        this.getData();

        if(this.settings.activelanguage == 'DE'){
            speech.voice = voices[1]
        }

        if (this.settings.activelanguage == 'SP') {
            speech.voice = voices[5]
        }

        if (this.settings.activelanguage == 'RU') {
            speech.voice = voices[16]
        }

        if(parseInt(this.settings.random) == 1){
            this.settings.random = true;
        } else {
            this.settings.random = false;
        }


        document.querySelector('#answerinput').focus()
    },
}).mount('#app')



