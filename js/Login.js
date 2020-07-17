class Login{
    constructor(){
        this.emailInput = document.getElementById('userInput');
        this.passwordInput = document.getElementById('passwordInput')
        this.buttonSubmit = document.getElementById('submitBtn');

        this.message = document.getElementById('message');
    }

    resetForm = () => {
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-valid')
        })

        this.emailInput.value = '';
        this.passwordInput.value = '';
    }

    addListeners = () => {

        // Asignamos eventos a los botones
        this.emailInput.addEventListener('blur', this.handleEmail)
        this.passwordInput.addEventListener('blur', this.handlePassword)
        this.buttonSubmit.addEventListener('click', this.submit)
    }

    submit = (e) => {
        e.preventDefault();
        this.handelLogin();
    }

    handelLogin = () => {

        const users = db.getAllUsers();

        const userSession = db.getSesion()

        let matchUser = users.find(user => user.email === this.emailInput.value);
        let matchPassword = users.find(user => user.password === this.passwordInput.value);

        if(matchUser === undefined|| matchPassword === undefined ){
            this.message.classList.remove('is-valid');
            this.message.innerHTML = 'email or / and password are incorrect'
            this.message.classList.remove('d-none');
            return;
        }

        //Si existe sesión
        if(userSession !== null){
            console.log('Si existe sesión...')
            // Limpiamos anterior user
            const oldLogin = document.querySelector('.dropdown.nav-user')
            const parent = oldLogin.parentNode;
            parent.removeChild(oldLogin);
        }

        // activamos la sesión
        db.activeSession(matchUser)
        db.showUserPannel();

        this.message.classList.remove('d-none');
        this.message.classList.add('is-valid');
        this.message.innerHTML = 'You are loged, wellcome!'

        setTimeout(()=> {
            this.message.classList.add('d-none'); 
        }, 4000)
    }

    

    getUserSession = () => {
        const userSession = db.getSesion();

        if(userSession !== []){
            return userSession
        } else {
            return []
        }
    }

    init = () => {
        this.addListeners();
        this.resetForm();
    }
    
}

const login = new Login();

window.addEventListener('load', login.init)