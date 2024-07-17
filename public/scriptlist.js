let app = Vue.createApp({
    data() {
        return {
            questions: [],
            settings: {

            },
            formadd: {
                question: '',
                answer: '',
                language: '',
                tags: ''
            },
            sortkey: '',
            sortorder: 1
        }
    },
    computed: {
        filtered() {
            let self = this;
            let sortorder = this.sortorder;


            let filtered = this.questions;

            if (this.sortkey) {
                filtered = filtered.sort(function (a, b) {
                    console.log(self.sortkey);

                    var a = a[self.sortkey];
                    var b = b[self.sortkey];

                    if (self.sortkey == 'id') {
                        a = parseInt(a);
                        b = parseInt(b);
                    }

                    // Compare the 2 dates
                    return (a === b ? 0 : a > b ? 1 : -1) * sortorder;
                })
            }

            return filtered;

        }
    },
    methods: {
        sortuj(key) {
            console.log(key);
            if (key == this.sortkey) {
                console.log('widzi to samo');
                if (this.sortorder == 1) {
                    this.sortorder = -1;
                } else if (this.sortorder == -1) {
                    this.sortorder = 1;
                }
            } else {
                this.sortkey = key;
            }

        },
        async getData() {
            let self = this;
            await axios.get('api/questions.php').then((res) => self.questions = res.data)

            this.questions = this.questions.filter((el) => el.language == self.settings.activelanguage);


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
        questionAdd() {
            let form = { ...this.formadd };
            if (form.random) {
                form.random = 1;
            } else {
                form.random = 0;
            }
            axios.post('/api/questionadd.php', form).then((res) => location.reload())
        }
    },
    async mounted() {
        let self = this;
        await axios.get('api/settings.php').then((res) => self.settings = res.data);
        this.formadd.language = this.settings.activelanguage;
        this.getData();

    }

}).mount('#app')