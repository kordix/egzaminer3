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


let app = Vue.createApp({
    data(){
        return {
            currentlanguage:'DE',
            dupa:'afsadfs',
            questions:[],
            currentQuestion:{},
            answer:'',
            answerTrue:false,
            answerFalse:false,
            settings:{}

        }
    },
    methods:{
        async getData(){
            let self = this;
            await axios.get('api/questions.php').then((res)=>self.questions = res.data);


            if(this.settings.operator == '<'){
                this.questions = this.questions.filter((el) => el.counter < self.settings.counterset);
            }

            if (this.settings.operator == '>') {
                this.questions = this.questions.filter((el) => el.counter > self.settings.counterset);
            }


            this.currentQuestion = this.questions.find((el) => el.language = self.currentlanguage)
            


        },
        next(){
            self = this;
            this.currentQuestion = this.questions.find((el)=>el.id > self.currentQuestion.id);
            if(!this.currentQuestion){
                this.currentQuestion = this.questions.find((el) => el.language = self.currentlanguage);

                if(!this.currentQuestion || this.questions.length == 1){
                    this.emptyprompt = true;
                }
            }

            return;
            this.answerTrue = false;
            this.answerFalse = false;

            this.answer = '';

            setTimeout(function(){
                document.querySelector('#answerinput').focus()
            },150)
           
        },
        getQuestion(){
            let self = this;
        },
        handleAnswer(){
            if(this.answerTrue || this.answerFalse){
                return
            }
            if (this.answer.escapeDiacritics().toLowerCase() == this.currentQuestion?.answer.escapeDiacritics().toLowerCase()){
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
        updateSettings(){
            axios.post('/api/updatesettings.php',this.settings).then((res)=>location.reload())
        }
    
    },
    async mounted(){
        let self = this;
        await axios.get('api/settings.php').then((res)=>self.settings = res.data)
        this.getData();

        

        
        document.querySelector('#answerinput').focus()
    },
}).mount('#app')