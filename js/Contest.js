class Contest {
    constructor(rounds){
        this.maxRounds = rounds;
        this.currentRound = 1;
        this.colorWheel = '';
        this.segments = [];
        this.roulette = null;
        this.user = db.getSesion();
        this.topic = '';
        this.pannelObj = {}
        
        this.orintationBtn = document.getElementById('playOrientationBtn')
        this.wheelPlayButton = document.getElementById('wheelBtnPlay');

        this.contestUserName = document.getElementById('contestUserName');
        this.contestTopicName = document.getElementById('contestTopicName');
        this.introWheelContent = document.getElementById('wheelSection_actionsIntro');
        this.resultWheelContent = document.getElementById('wheelSection_actionsResult');
        this.roundNumber = document.querySelector('.wheelSection_actions_title span');
        this.headerRoundNumber = document.getElementById('roundHeaderContest');
        this.bgWheel = document.getElementById('bgWheel');
        this.bgContest = document.querySelector('contestContent');

        this.pannelHeader = document.getElementById('infoPannel');
        this.whellWrapperSecion = document.getElementById('WheelWrapper');
        
        this.headerRoundNumber.innerHTML = this.currentRound;

        this.orientationMsg = document.getElementById('orientationMsg');
    }

    checkContest(){
        if(this.currentRound === this.maxRounds){
            alert('Concurso acabado!');
        }
    }

    bgWheelRandom(){
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const randomImgWheel = Math.floor(Math.random()*3);
        let extension = '';
        if (vw < 1201) extension = '_sm';
        const imgUrlWheel = `./assets/img/wheel/bg_wheel${extension}_${randomImgWheel}.jpg`;
        this.bgWheel.setAttribute(`style`, `background-image: url(${imgUrlWheel});`);
    }

    async createWheel(){
        let query = await fetch("https://swapi.py4e.com/api/");
        let json = await query.json();
        let categoryArr = Object.keys(json);

        categoryArr.forEach( (segment,i) => {
            switch(i%2 === 0){
                case true:
                    this.colorWheel = '#D8D8D8';
                    break;
                case false:
                    this.colorWheel = '#A3BDD8';
                    break;
            }
            this.segments.push(
                {
                    'fillStyle': this.colorWheel, 'text': segment, 'textFontFamily': 'Monda', 'textFontSize': '14'
                }
            )
        })
        
        this.roulette = new Winwheel({
            'canvasId'    : 'canvas',
            'numSegments' : 6,
            'lineWidth'   : 4,
            'segments'    : this.segments,
            'animation' :                   // Note animation properties passed in constructor parameters.
            {
                'type'     : 'spinToStop',  // Type of animation.
                'duration' : 3,             // How long the animation is to take in seconds.
                'spins'    : 8,
                'callbackFinished' : 'alertPrize()'
            }
        });

        /*this.roulette.animation.callbackFinished = function alertPrize() {
            let winningSegment = this.roulette.getIndicatedSegment();
            alert("You have won " + winningSegment.text + "!");
        }*/

        this.wheelStartBtn = document.getElementById('wheelBtn');

        // Asignamos eventos a los botones
        this.wheelStartBtn.addEventListener('click', () => {
            this.roulette.startAnimation();
            this.wheelStartBtn.disabled=true;
        })
    }

    checkViewport(){
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        if(vw < 1000){
            this.showOrientationMsg()
        } else {
            this.hideOrientationMsg();
        }
    }

    showOrientationMsg(){
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const el = this.orientationMsg;
        el.classList.remove('d-none');
        el.style.opacity = 0;
        setTimeout(() =>{
            el.style.opacity = '1' 
        }, 100);

        if(vw < 1000){
            this.orintationBtn.innerHTML = 'Turn it!'
            this.orintationBtn.disabled = true;
        } else {
            this.orintationBtn.innerHTML = `Ok let's play!`
        }
    }

    hideOrientationMsg = (e) => {
        const el = this.orientationMsg;
        el.style.opacity = 0;
        setTimeout(() =>{ el.style.display = 'none' }, 100);

    }

    async addListeners() {
        this.orintationBtn.addEventListener('click', this.hideOrientationMsg)
        this.wheelPlayButton.addEventListener('click', this.prepareGame)
    }

    async handleCategory(category){
        this.topic = category;
        await this.generateNamePannel(this.topic);
        this.showWheelContent()
    }

    async generateNamePannel(topic){

        let topicCategory = [];

        // Cargamos selector especies
        const query = await fetch(`https://swapi.py4e.com/api/${topic}/`);
        const json = await query.json();
        topicCategory.push(...json.results);

        let pagination = Math.ceil(json.count / json.results.length);

        for(let i = 2; i <= pagination; i++){
            let query = await fetch(`https://swapi.py4e.com/api/${topic}/?page=${i}`)
            let json = await query.json();
            topicCategory.push(...json.results);
        }

        let pannelName = []
        if(topic === 'films'){
            topicCategory.map(result => pannelName.push(result.title));
        } else{
            topicCategory.map(result => pannelName.push(result.name));
        }

        const randomIndex = Math.floor(Math.random()*pannelName.length);

        //console.log(`pannelName: ${pannelName[randomIndex]}`)

        this.pannelObj = {
            category: topic,
            pannel: pannelName[randomIndex]
        }
      }

    updateRound(){
        if(this.currentRound > this.maxRounds){
            this.currentRound = this.maxRounds;
        } else{
            return this.currentRound+=1;
        }
    }

    async nextRound() {
        this.topic = '';
        this.updateRound();
        await this.initContest()
        this.showWheelContent()
    }

    async showWheelContent() {

        this.roundNumber.innerHTML = this.currentRound;
        this.contestUserName.innerHTML = this.user.name;
        this.contestTopicName.innerHTML = this.topic || '';
        this.introWheelContent.style.opacity = 0;
        this.resultWheelContent.style.opacity = 0;

        if(this.topic === '') {
            this.introWheelContent.style.opacity = '1';
            this.introWheelContent.classList.toggle('d-none');
            this.resultWheelContent.classList.add('d-none');
        } else {
            this.introWheelContent.classList.add('d-none');
            this.resultWheelContent.classList.toggle('d-none');
            this.resultWheelContent.style.opacity = '1';
        }
    }

    prepareGame = () => {

        this.pannelHeader.classList.remove('isWheel');
        this.pannelHeader.classList.add('isContest');
        this.whellWrapperSecion.classList.add('exit')

        this.initGame(this.pannelObj, this.user)

    }

    async initContest(){
        await this.showWheelContent();
        await this.createWheel()
        await this.addListeners()    
    }

    initGame(category, user){
        const game = new Game(category, user);
        game.initGame();
    }
    
}


// Comprobamos que haya sesión de login
db.checkSession()

// Inicializamos concurso
const contest = new Contest(6);
window.addEventListener('load', contest.initContest())
window.addEventListener('onorientationchange', contest.checkViewport())
window.addEventListener('resize', contest.checkViewport())
contest.bgWheelRandom()
contest.checkViewport()

// WHEEL 
// No se como instancarla dentro del método create Wheel :/

function alertPrize(){
    // Call getIndicatedSegment() function to return pointer to the segment pointed to on wheel.
    let winningSegment = contest.roulette.getIndicatedSegment();

    // Basic alert of the segment text which is the prize name.
    contest.handleCategory(winningSegment.text)
}


