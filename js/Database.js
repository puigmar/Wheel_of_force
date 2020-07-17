class Database {
    getAllUsers = () => {
        let usersDB = localStorage.getItem('users');
        let usersArr = JSON.parse(usersDB);

        // si todavia no hay usuarios, devuelve un array vacio
        if (usersArr === null) {
            return [];
        } else {
            return usersArr;
        }
    }

    saveUser = (userObj) => {

        const usersArr = this.getAllUsers();
                
        usersArr.push(userObj);

        const usersStr = JSON.stringify(usersArr);

        localStorage.setItem("users", usersStr);

    }

    activeSession = ( userObj ) => {

        //limpiamos la sesión anterior
        localStorage.setItem('session','');

        const userStr = JSON.stringify(userObj);
        localStorage.setItem('session',userStr);
    }

    updateUserPoints = ( userObj ) => {

        // Recogemos todos los users de la DB
        const allUsers = this.getAllUsers();

        // Recogemos datos del usuario que tiene la sesión activa
        const sessionUSer = this.getSesion();

        // Filtramos el usuario actual de la DB
        const currentUserDB = this.getAllUsers().find(user => (user.email === sessionUSer.email));

        // Filtramos el resto de usuarios de la DB
        const restUserDB = this.getAllUsers().filter(user => (user.email !== sessionUSer.email));

        // Actualizamos los puntos en el objeto encontrado en la BD 
        // y en el usuario con sesión activa
        currentUserDB.points = userObj.points;
        sessionUSer.points = userObj.points;

        // armamos nuevo array con los filtrados de la BD y el usuario actual
        // con los puntos actualizados
        const newArrusersDB = []
        newArrusersDB.push(currentUserDB);
        restUserDB.forEach(user => {
            newArrusersDB.push(user);
        })

        // Pasamos a string
        const newArrusersDBStr = JSON.stringify(newArrusersDB);
        const sessionUSerStr = JSON.stringify(sessionUSer);

        // Actualizamos LocalStorage
        localStorage.setItem('session',sessionUSerStr);
        localStorage.setItem('users',newArrusersDBStr);

    }

    getSesion = () => {
        const userActive = localStorage.getItem('session');
        const userActiveArr = JSON.parse(userActive);

        return userActiveArr;
    }

    checkSession = () => {
        const user = this.getSesion();
        
        if(!user){
            goTo('login');
        }
    }

    showUserPannel = () => {
        const user = this.getSesion();

        if(user){
            const parent = document.querySelector('header .nav-tools-group');
            const userPannel = document.createElement('div');
            userPannel.classList.add('dropdown','nav-user');
            // parent.removeChild(userPannel)
    
            userPannel.innerHTML = 
                `<div class="dropdown nav-user">
                    <a class="dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="nav-user-name">Hi ${user.name}</span>
                        <span class="icon-user nav-user-icon"></span>
                    </a>
                   
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <p class="dropdown-item points-item">You have ${user.points} points</p>
                        <a class="dropdown-item" href="#">Profile</a>
                        <a class="dropdown-item" href="./contest.html">Wheel of Force!</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">Logout</a>
                    </div>
                </div>`

            parent.appendChild(userPannel)
        }        
    }
}

const db = new Database();
db.showUserPannel()