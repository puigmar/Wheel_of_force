class Game {
    constructor(pannelObj, user) {
      this.user = user
      this.topic = pannelObj.category
      this.correctAnswer = pannelObj.pannel
      this.guessWords = []
      this.vocals = ['A','E','I','O','U']
      this.letterValue = 10
      this.vocalCost = this.letterValue + 30
      this.winGame = false

      // Asignamos elementos html
      this.priceWrapper = document.getElementById('contestPoints')
      this.pushButton = document.getElementById('pushLetterBtn')
      this.pushInput = document.getElementById('pushLetterInput')
      this.pannel = document.getElementById('pannel')
      this.titlePannel = document.querySelector('#pannelSection h1')
      this.msgPannel = document.getElementById('msgPannel')
      this.solveDomBtn = document.getElementById('solveBtn')
      this.solveModalForm = document.getElementById('solveModal_form')
      this.priceWrapper.innerHTML = this.user.points
      this.modalSolvePanelBtn = document.getElementById('solvePannel')
      this.bgGame = document.querySelector('.contestContent');

      this.modalSuccessGame = document.getElementById('modalSuccessGame')
      this.modalFailGame = document.getElementById('modalFailGame')

      this.errorQuantityPoints = "Yo don't have enough point yet!"
      this.errorWrongLetter = "This Letter doesn't appear in the panel!"
      this.errorRepeatLetter = "Ei! this word already exist in the panel!"
      this.errorNoExist = "Ohh almost, but it doesn't exist!"

      this.errors = {
        errorQuantityPoints: this.errorQuantityPoints,
        errorWrongLetter: this.errorWrongLetter,
        errorRepeatLetter: this.errorRepeatLetter,
        errorNoExist: this.errorNoExist
      }

    }

    bgGameRandom(){
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const randomImgWheel = Math.floor(Math.random()*5);
      let extension = '';
      if (vw < 1201) extension = '_sm';
      const imgUrlContest = `./assets/img/wheel/bg_wheel${extension}_${randomImgWheel}.jpg`;
      this.bgGame.setAttribute(`style`, `background-image: url(${imgUrlContest});`);
    }
  
    addPoints = (num) => {
      this.user.points += num;
      this.UpdatePoints(this.user.points)
    }
  
    removePoints = (num) => {

      this.user.points -= num;

      if (this.user.points < 0) {
        this.user.points = 0
      }
      this.UpdatePoints(this.user.points)
    }

    // Refrescamos puntos del usuario
    UpdatePoints = (points) => {
      this.user.points = points
      this.priceWrapper.innerHTML = points
    }
    
    checkPointsforVocals = (letter) => {

      const vocalMatches = this.checkPanelRepeatLetter(letter)

      // Si el total de vocales acertadas * el coste de la vocal
      // es mayor que los puntos que tiene el usuario
      // devolvemos false, no se pueden comprar las vocales
      // si no, devolvemos true
      let result = true
      
      if(vocalMatches.length === 0){
        //console.log('No hay resultados de vocales acertadas')
        return false
      } else {
        if (this.vocalCost > this.user.points) {
          result = false
        } else {
          result = true

          // Sabemos que la vocal se puede comprar y que existe en el panel
          // Deshabilitamos el botón
          this.manageVocalPannel(letter)
        }
        //const result = (vocalMatches.length*this.vocalCost > this.user.points) ? false : true
        //console.log(`¿Es posible comprar vocal? : ${result} => costeVocal = ${this.vocalCost} vs puntos usuario ${this.user.points}`)
        return result
      }      
    }

    // gestionamos el panel de vocales para deshabilitar las ya usadas
    manageVocalPannel = (letter) => {
      const buttonVocals = document.querySelectorAll('.actionsPannel_vocals li button')

      buttonVocals.forEach(button => {
        if(button.innerHTML === letter){
          button.disabled = 'disabled'
        }
      })

    }
    
    // Generamos el panel de palabras a partir de un string
    generatePanel = (string) => {

      // Asignamos variable pannel al elemento html con id #pannel
      let pannel = document.getElementById("pannel")

      let pannelName = string
      let wordArr = []
      let cellIndex = []

      // Recorremos toda la palabra
      for(let i= 0; i < pannelName.length; i++){
        cellIndex.push(i)
        // Si el carácter no tiene espacio
        if(pannelName[i] !== ' '){
          // Añadimos la letra al array de palabra wordArr
          wordArr.push(pannelName[i])
          // Si esla última iteración y llegamos a la última letra
          if(i === pannelName.length-1){
              // Creamos las celdas agrupadas con word
              this.createCells(pannel, wordArr, cellIndex)
              cellIndex = []
          }
        // Si el caracter es un espacio
        } else if( pannelName[i] === ' ') {
            
            // Creamos la agrupación word con las útlimas letras del array
            // wordArray 
            this.createCells(pannel, wordArr, cellIndex)
            cellIndex = []
            // creamos celda vacía y la añadimos al panel
            let emptyCell = document.createElement('div')
            emptyCell.setAttribute('class', 'pannel_cell space')
            pannel.appendChild(emptyCell)

            // Vacíamos el array de palabra
            wordArr = []
        }
      }
    }

    // Generamos el panel de vocales a partir de un array
    generateVocals = (vocalsArr) => {
      const parentWraperVocals = document.querySelector('.actionsPannel_vocals');
      const ulVocals = document.createElement('ul');
      vocalsArr.forEach( (vocal,i) => {
        let liVocal = document.createElement('li');
        liVocal.innerHTML = `<button type="button" data-vocal="${vocalsArr[i]}">${vocalsArr[i]}</button>`
        ulVocals.appendChild(liVocal)
      })
      parentWraperVocals.appendChild(ulVocals)
    }

    // Creamos las agrupaciones de palabras en el panel
    createCells = (wrapper, arrayLetters, indice) => {
      let word = document.createElement('div');
      word.setAttribute('class', 'word');
      arrayLetters.forEach((wordLetter, i) => {
          let letter = document.createElement('div');
          letter.setAttribute('class', 'pannel_cell');
          letter.setAttribute('id', 'cell'+indice[i]);
          letter.setAttribute('data-letter', wordLetter.toUpperCase());
          word.appendChild(letter);
      })
      wrapper.appendChild(word)
    }

    // Comprobamos que en el panel de consonantes no se usen vocales
    // Si se pone borramos el texto antes de envíar
    checkVocals = () => {
      let letter = document.getElementById('pushLetterInput').value;
      let isVocal = false;
      this.vocals.forEach(vocal => {
        if(vocal === letter.toUpperCase()){
          isVocal = true;
        }
      })

      if(isVocal){
        document.getElementById('pushLetterInput').value = '';
      }
    }

    // Gestionamos el mensaje que aparece dependiendo de las acciones del usuario
    showMessage(string){
      const durationMessage = 6000; // 3sec
      const msgDiv = this.msgPannel.querySelector('div');
      msgDiv.innerHTML = '';
      
      msgDiv.innerHTML = string;

      this.msgPannel.style.opacity = 1;

      setTimeout( () => {
        this.msgPannel.style.opacity = 0;
      }, durationMessage)
    }
    
    pushLetter = (e) => {

      let letter = '';

      // Si viene del panel de vocales
      if(e.target.getAttribute('data-vocal')){
        
        letter = e.target.getAttribute('data-vocal');
        
        // Si la palabra ya existe en el panel
        if(this.checkCurrentGuess(letter)){
          showMessage(this.errors.errorRepeatLetter);
          return;
        }

        if(this.vocals.includes(letter)){
          
          // user have enought points to buy a vocal
          if(this.checkPointsforVocals(letter)){
             // Descontamos coste de la vocal
             this.removePoints(this.vocalCost);
          } else {

            if(this.checkPanelRepeatLetter(letter).length > 0) {
              // Mandamos mensaje de error 'No tienes suficientes puntos'
              showMessage(this.errors.errorQuantityPoints)
            }
            return;
          }
        }

      // Si es una consonante del panel de consonantes
      } else {
        // Si viene del panel de consonantes letter la cogemos de dicho panel
        letter = document.getElementById('pushLetterInput').value;
      }
      
      // Chequeamos letra en el panel
      // Si hay letras correctas

      if(this.checkPanelRepeatLetter(letter).length > 0){

        // Comprobamos que no exista previamente en el panel
        if(this.checkCurrentGuess(letter)){
          // reseteamos el input del pane de consonantes
          this.resetPushLetterInput();
          return
        }

        // Asignamos el array de id's de letras correctas a correctLetters
        const correctLetters = this.checkPanelRepeatLetter(letter);

        // Lo recorremos para buscar la id y cambiar su contenido por la letra
        correctLetters.forEach(correctLetter => {
          let cellTarget = document.getElementById(correctLetter);
          cellTarget.innerHTML = letter;
          
          // Guardamos la letra en el array de letras acertadas
          this.guessWords.push(letter);
        })

        // Solo sumamos los puntos si la letra es distinta a una vocal
        if(!this.vocals.includes(letter)){

          //Calculamos los puntos ganados
          const pointsEarned = this.calculatePoints(correctLetters)

          // Los sumamos al panel del usuario
          this.addPoints(pointsEarned)

        }


      } else {
        
        // No exiten coincidencias, por lo que mandamos mensaje de error
        this.showMessage(this.errors.errorNoExist)
      }

      // reseteamos el input del pane de consonantes
      this.resetPushLetterInput();

    }

    // Devuelv false si el la letra ya ha sido acertada previamente
    checkCurrentGuess = (letter) => {
      //console.log(`¿Esta letra ${letter} ya está en el panel? ${this.guessWords.includes(letter)}`)
      return this.guessWords.includes(letter)
    }

    resetPushLetterInput = () => {
      this.pushInput.value = '';
    }

    // Chequeamos que cantidad de letras coinciden con el panel y devolvemos
    // un array con la lista de las coincidencias
    checkPanelRepeatLetter = (_letter) => {
      let cells = this.pannel.querySelectorAll('.pannel_cell:not(.space)');
      let letter = _letter.toUpperCase();
      let correctLetters = [];

      cells.forEach(cell => {
        // localizamos a la celda dento del html con su id
        let cellHtml = document.getElementById(cell.id);

        // Si la letra coincide con el la celda del panel
        // alamcenamos la letra en el array correctLetters
        if(cellHtml.getAttribute('data-letter') === letter){
          correctLetters.push(cell.id)
        }
      })

      return correctLetters;

    }


    // retornamos los puntos segun las veces que se repite la letra subida al panel
    calculatePoints = (correcLetters) => {

      let numLetters = correcLetters.length;

      // chequeamos si son vocales o no, siempre y cuando no se haya ganado la partida
      if(this.vocals.includes(correcLetters[0] && !this.winGame)){
        // Devolvemos el valor según el número de vocales encotradas
        return this.vocalCost;
      }
      // devolvemos el resultado teniendo en cuenta el valor de las consonantes
      return numLetters * this.letterValue;
    }


    // Chequeamos si el juego se ha terminado
    checkResultGame = () => {
      let correctAnswer = this.correctAnswer.toLowerCase().split(' ').join('');
      let pannel = document.querySelectorAll('.pannel_cell:not(.space)');
      let pannelAnswer = [...pannel].map( item => item.textContent).join('').toUpperCase();

      // Comparamos la respuesta inicial de la API correctAnswer con la del panel pannelAnswer
      if(correctAnswer === pannelAnswer){
          // Has ganado
          console.log('Has ganado!!!')
      }
    }

    solveBtn = () => {
      this.generateSolveForm();
      $('#solveModal').modal('show');
    }

    getInfoPannel = () => {
      const pannelName = document.querySelectorAll('.pannel_cell');
      const solveLettersArr = [];

      pannelName.forEach(cell => {
        let cellValue = '';
        let cellIdValue = cell.id;

        if(document.getElementById(cell.id) === null){
          cellValue = ' ';
        } else {
          cellValue = document.getElementById(cell.id).innerHTML;
        }

        solveLettersArr.push({cellId: cellIdValue, value: cellValue});

      })

      return solveLettersArr;

    }

    generateSolveForm = () => {
      const parentForm = document.getElementById('solveModal_form');

      // Inicializamos el pannel
      parentForm.innerHTML = '';

      const pannelObj = this.getInfoPannel();
      
      const divForm = document.createElement('div');
      divForm.className = 'form-group';

      pannelObj.forEach(letter => {
        if(letter.value === ' '){
          divForm.innerHTML += `
            <br>
          `
        } else {
          divForm.innerHTML += `
            <input type="text" class="form-control" id="${letter.cellId}" value="${letter.value}">
          `
        }
        
      })

      parentForm.appendChild(divForm);

    }

    checkSolve = () => {
      const solveCells = this.solveModalForm.querySelectorAll('.form-control');
      const pannelSecretName = this.correctAnswer.split(' ').join('').toLowerCase();

      const solvePannelModalArr = []
      solveCells.forEach(solveCell => {
        solvePannelModalArr.push(solveCell.value)
      })

      const solvePannelName = solvePannelModalArr.join('');

      return pannelSecretName === solvePannelName
    }

    handleSolvePannel = () => {

      // Independientemente del resultado escondemos el modal de la opción de resolver
      $('#solveModal').modal('hide')
      this.handleGameResult();

    }

    getResolvePoints = () => {

        // Sumamos puntos ganados por resolver el panel
        const pannelSecretNameArr = this.correctAnswer.split(' ');
        const pannelSecretName = this.correctAnswer.split(' ').join('').toLowerCase();

        // Descontamos las letras que ya se hayan puesto antes de resolver
        let letterDisplayedArr = []
        const pannelLetterDisplayed = document.querySelectorAll('#pannel .pannel_cell:not(.space');
        pannelLetterDisplayed.forEach(cell => {
          if(cell.innerHTML !== ''){
            letterDisplayedArr.push(cell);
          }
        })
        let displayedResult = letterDisplayedArr.length * this.letterValue;
        

        let result = 0;
        pannelSecretNameArr.forEach(word => {
          result += this.calculatePoints(word)
        })

        return result - displayedResult;
    }

    handleGameResult = () => {

      if(this.checkSolve()){
        this.winGame = true;
        // Actualizamos los puntos del usario
        this.UpdatePoints(this.getResolvePoints());
      }

      if(this.winGame){

        // Cargamos datos modal ganador
        this.modalSuccessGame.innerHTML = `
              <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-body">
                      <span class="icon-win"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span></span>
                      <h2 class="h2">Great ${this.user.name}! Already for another round?</h2>
                      <p class="text-success">Your current points are ${this.user.points}</p>
                  </div>
                  <div class="modal-footer">
                      <button id="leaveGameBtn" type="button" class="btn btn-secondary btn-md">Leave the game</button>
                      <button type="button" id="nextRoundBtn" class="btn btn-primary btn-md">Go to the Round ${contest.currentRound+1}!</a>
                  </div>
              </div>
          </div>
        `

        this.nextRoundBtn = document.getElementById('nextRoundBtn');
        this.nextRoundBtn.addEventListener('click', this.handdleNextRound())

        this.leaveGameBtn = document.getElementById('leaveGameBtn');
        this.leaveGameBtn.addEventListener('click', () => {this.goTo('index')})

        // Lanzamos Modal
        $('#modalSuccessGame').modal('show');
        
      } else {

        console.log('cargando modal Loser')

        // Cargamos datos modal perdedor
        this.modalFailGame.innerHTML = `
          <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-body">
                  <span class="icon-lose"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></span>
                  <h2 class="h2">Oh no ${this.user.name}! You have fallen on the dark side :(</h2>
                  <p class="text-success">Your current points are ${this.user.points}</p>
              </div>
              <div class="modal-footer">
                  <button id="starNewGameBtn" type="button" class="btn btn-secondary btn-md">Start a New Game</button>
              </div>
          </div>
          </div>
        `

        this.modalNewGameBtn = document.getElementById('starNewGameBtn');
        this.modalNewGameBtn.addEventListener('click', () => {this.goTo('contest')})

        // Lanzamos Modal
        $('#modalFailGame').modal('show');

      }

      // Grabamos en la DB los puntos, tanto el usuario con sesión, como en la DB genérica
      db.updateUserPoints(this.user)

    }


    handdleNextRound = () => {
      $('#modalSuccessGame').modal('hide');
    }



    addListeners = () => {
      //AddEvents
      this.pushButton.addEventListener('click', this.pushLetter)
      this.pushInput.addEventListener('input', this.checkVocals)
      this.solveDomBtn.addEventListener('click', this.solveBtn)
      this.modalSolvePanelBtn.addEventListener('click', this.handleSolvePannel)

      const vocals = document.querySelectorAll('.actionsPannel_vocals button');
      vocals.forEach(vocal => {
        vocal.addEventListener('click', this.pushLetter)
      })
    }

    initGame = () => {
      this.titlePannel.innerHTML = this.topic;

      this.bgGameRandom()

      // localizamos contenedor del precio de la vocal y le añadimos el calculo según this.vocalCost
      let vocalCost = document.getElementById('vocalValue');
      vocalCost.innerHTML = this.vocalCost;

      // Generamos el panel
      this.generatePanel(this.correctAnswer)
      this.generateVocals(this.vocals)

      // Añadimos los listeners de los elementos HTML
      this.addListeners();
    }
}