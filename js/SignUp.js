class Signup{
    constructor(){
        this.specieInput = document.getElementById('specieInput');
        this.emailInput = document.getElementById('userInput');
        this.passwordInput = document.getElementById('passwordInput');
        this.repeatPasswordInput = document.getElementById('passwordRepeatInput');
        this.name = document.getElementById('nameInput');
        this.buttonSubmit = document.getElementById('submitBtn');
    }

    handleSpecie = (e) => {
        const specie = e.target.value;

        // validamos con validator
        validator.validateSpecies(e, specie);
        this.checkSubmitButton();
    }

    handleEmail = (e) => {
        const email = e.target.value;

        // validamos con validator
        validator.validateEmail(e, email);
        
        if(!validator.errorForms.errorEmailMsg){
            if(db.getAllUsers() !== null){
                if(db.getAllUsers().find(dbEmail => dbEmail.email === email)){
                    console.log('EMAIL REPETIDO')
                    validator.errorForms.errorEmailMsg = validator.invalidEmailError
                } else {
                    console.log('EMAIL ÚNICO')
                    delete validator.errorForms.errorEmailMsg
                }
            }
            
    
            validator.checkValidationMsg(e, validator.invalidEmailError)
        }
        this.checkSubmitButton();
    }

    handlePassword = (e) => {
        const password = e.target.value;
        // Validamos campo
        validator.validatePassWord(e, password);
        this.checkSubmitButton();
    }

    handleRepeatPassword = (e) => {
        const repeatPassword = e.target.value;
        const password = this.passwordInput.value;
        // Validamos campo
        validator.validateRepeatPassword(e, password, repeatPassword);
        this.checkSubmitButton();
    }

    handleName = (e) => {
        const name = e.target.value;
        // Validamos campo
        validator.validateName(e, name);
        this.checkSubmitButton();
    }

    resetForm = () => {
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-valid')
        })

        this.specieInput.selectedIndex = 0
        this.emailInput.value = '';
        this.passwordInput.value = '';
        this.repeatPasswordInput.value = '';
        this.name.value = '';
    }

    saveUser = (e) => {
        e.preventDefault();
        
        const errors = Object.keys(validator.errorForms);

        if(errors.length === 0 ){

            let specie = this.specieInput.value;
            let email = this.emailInput.value;
            let password = this.passwordInput.value;
            let name = this.name.value;

            const newUser = new User( name, specie, email, password)

            db.saveUser(newUser);

            this.resetForm();

            this.sucessMsg(name);
        }
    }

    addListeners = () => {

        // Asignamos eventos a los botones
        this.specieInput.addEventListener('change', this.handleSpecie)
        this.specieInput.addEventListener('blur', this.handleSpecie)

        this.emailInput.addEventListener('input', this.handleEmail)
        this.passwordInput.addEventListener('input', this.handlePassword)
        this.repeatPasswordInput.addEventListener('input', this.handleRepeatPassword)
        this.name.addEventListener('input', this.handleName)
        this.buttonSubmit.addEventListener('click', this.saveUser)
    }

    checkSubmitButton = () => {
        const errors = Object.keys(validator.errorForms);
        if(errors.length !== 0){
            this.buttonSubmit.disabled = true;
        } else {
            this.buttonSubmit.disabled = false;
        }
    }

    createSpeciesOptions = async () => {
        let species = [];

        // Cargamos selector especies
        const query = await fetch('https://swapi.py4e.com/api/species/');
        const json = await query.json();
        species.push(...json.results);

        let pagination = Math.ceil(json.count / json.results.length);
        
        for(let i = 2; i <= pagination; i++){
            let query = await fetch(`https://swapi.py4e.com/api/species/?page=${i}`)
            let json = await query.json();
            species.push(...json.results);
        }
        
        let options = []
        species.map(specie => options.push(specie.name));
                
        // Generamos options Select this.specieInput
        this.specieInput.innerHTML = `<option value=""></option>`;
        options.forEach(specie => {
            this.specieInput.innerHTML += `<option value="${specie}">${specie}</option>`;
        })
    }

    sucessMsg = (name) => {

        const parent = document.querySelector('main');

        const modal = document.createElement('div');
        modal.setAttribute('class', 'modal fade');
        modal.id = 'successModal';
        modal.tabIndex = '-1';
        modal.role = 'dialog';
        modal.setAttribute('aria-labelled', 'successModalLabel')
        modal.setAttribute('aria-hidden', 'true');
        
        const msgContent = `<div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <span class="icon-is-ok size-xl mb-3 d-block"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span></span>
                                        <h2 class="h2">Wellcome to the force ${name}!</h2>
                                        <p class="text-success">Your account has been created successfully</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary btn-md" data-dismiss="modal">Close</button>
                                        <a href="./login.html" class="btn btn-primary btn-md">Go to Login</a>
                                    </div>
                                </div>
                            </div>`
        
        modal.innerHTML = msgContent;
        parent.appendChild(modal)

        $('#successModal').modal('show')
        
    }

    async init(){
        this.addListeners();
        await this.createSpeciesOptions();
        this.checkSubmitButton();
        this.resetForm();
    }
    
}

const signup = new Signup();

window.addEventListener('load', signup.init())