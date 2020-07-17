const goTo = (destiny) => {
    let url = window.location.pathname.split('/')
    url.pop();
    let domain = url.join('/')+'/';
    window.location.href = domain+destiny+'.html'
}

// Función para activar menu

const handleMenu = (e) => {
    const el = e.currentTarget;
    const toggleId = el.getAttribute('data-toggle') 
    const menu = document.getElementById(toggleId)
    menu.classList.toggle('open')
}

//  Añadimos evetos a los botones de menú

const navMenuBtn = document.querySelectorAll('.navbar-toggler');
navMenuBtn.forEach(button => {
    button.addEventListener('click', handleMenu);
})