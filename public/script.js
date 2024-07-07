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


let app = Vue.createApp({
    data() {
        return {
            dupa: 'afsadfs',
            questions: [],
            currentQuestion: {},
            answer: '',
            answerTrue: false,
            answerFalse: false,
            settings: {},
            emptyprompt: false,
            tags:[]

        }
    },
    methods: {
        async getData() {
            let self = this;
            await axios.get('api/questions.php').then((res) => self.questions = res.data);


            this.questions = this.questions.filter((el) => el.language == self.settings.activelanguage);

            if(this.settings.currenttag){
                this.questions = this.questions.filter((el) => el.tags == self.settings.currenttag);

            }



            if (this.settings.operator == '<') {
                this.questions = this.questions.filter((el) => el.counter < self.settings.counterset);
            }

            if (this.settings.operator == '>') {
                this.questions = this.questions.filter((el) => el.counter >= self.settings.counterset);
            }


            this.currentQuestion = this.questions.find((el) => el.language = self.settings.activelanguage);

            this.tags = distinctValues(this.questions, 'tags');




        },
        next() {
            self = this;
            let currentQuestionIndex = this.questions.findIndex((el)=>el.id == self.currentQuestion.id);
            this.currentQuestion = this.questions[currentQuestionIndex + 1];
            if (!this.currentQuestion) {
                this.currentQuestion = this.questions.find((el) => el.language = self.settings.activelanguage);


                if (!this.currentQuestion || this.questions.length == 1) {
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
        prev() {
            self = this;

            let currentQuestionIndex = this.questions.findIndex((el) => el.id == self.currentQuestion.id);
            this.currentQuestion = this.questions[currentQuestionIndex - 1];

            if (!this.currentQuestion) {
                console.log('NIE WIDZI');
                this.currentQuestion = this.questions[this.questions.length - 1];
                // this.currentQuestion = this.questions.filter((el) => el.language = self.activelanguage)?.sort((a, b) => b.value + a.value)[0];

                if (!this.currentQuestion || this.questions.length == 1) {
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

            if (this.settings.tryb == 'DEPOL') {
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
            axios.post('/api/updatesettings.php', this.settings)
        }

    },
    async mounted() {
        let self = this;
        await axios.get('api/settings.php').then((res) => self.settings = res.data)
        this.getData();




        document.querySelector('#answerinput').focus()
    },
}).mount('#app')