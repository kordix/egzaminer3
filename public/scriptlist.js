let app = Vue.createApp({
    data() {
        return {
            questions: [],
            settings: {

            },
            formadd:{
                question:'',
                answer:'',
                language:'',
                tags:''
            }
        }
    },
    methods: {
        async getData() {
            let self = this;
            await axios.get('api/questions.php').then((res) => self.questions = res.data)
            
            this.questions = this.questions.filter((el)=>el.language == self.settings.activelanguage);


            if (this.settings.operator == '<') {
                this.questions = this.questions.filter((el) => el.counter < self.settings.counterset);
            }

            if (this.settings.operator == '>') {
                this.questions = this.questions.filter((el) => el.counter > self.settings.counterset);
            }

        },
        updateSettings() {
            axios.post('/api/updatesettings.php', this.settings).then((res) => location.reload())
        },
        questionAdd(){
            axios.post('/api/questionadd.php', this.formadd).then((res) => location.reload())
        }
    },
    async mounted() {
        let self = this;
        await axios.get('api/settings.php').then((res) => self.settings = res.data);
        this.formadd.language = this.settings.activelanguage;
        this.getData();

    }

}).mount('#app')