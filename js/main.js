const goTo = (destiny) => {
    let url = window.location.pathname.split('/')
    url.pop();
    let domain = url.join('/')+'/';
    window.location.href = domain+destiny+'.html'
}