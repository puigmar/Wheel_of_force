class Warsiepedia {
    constructor(selectorId){
        this.selectCategoriesDom = document.getElementById(selectorId);
        this.wrapperCards = document.getElementById('selectorresult');
        this.wrapperContent = document.querySelector('.wrapperCards');
        this.categories = []
    }

    getCategories = async () => {
        let query = await fetch("https://swapi.py4e.com/api/");
        let json = await query.json();
        let categoryArr = Object.keys(json);

        let options = []
        categoryArr.map(cat => options.push(cat.name));

        // Generamos options Select
        //this.selectCategoriesDom.innerHTML = `<option value=""></option>`;

        categoryArr.forEach( cat => {
            this.selectCategoriesDom.innerHTML += `<option value="${cat}">${cat}</option>`;
        })
    }



    loadCategorySelection = async (catValue) => {

        let categoryResult = [];

        // Cargamos selector de la categoria
        const query = await fetch(`https://swapi.py4e.com/api/${catValue}/`);
        const json = await query.json();
        categoryResult.push(...json.results);

        let pagination = Math.ceil(json.count / json.results.length);
        
        for(let i = 2; i <= pagination; i++){
            let query = await fetch(`https://swapi.py4e.com/api/${catValue}/?page=${i}`)
            let json = await query.json();
            categoryResult.push(...json.results);
        }

        this.wrapperCards.innerHTML = '';

        return categoryResult;

    }

    selectElement = async (e) => {    
        const loadCategories = await this.loadCategorySelection(e.target.value)
        this.showCategoryResult(loadCategories, e.target.value);
    }

    showCategoryResult = (catArr, catName) => {
        
        const bg_cats = {
            people: './assets/img/bg_people.jpg',
            films: './assets/img/bg_films.jpg',
            species: './assets/img/bg_species.jpg',
            starships: './assets/img/bg_starships.jpg',
            vehicles: './assets/img/bg_vehicles.jpg',
            planets: './assets/img/bg_planets.jpg'
        }

        const category = catArr;
        const parent = this.wrapperCards;
        this.wrapperContent.setAttribute(`style`, `background-image: url(${bg_cats[catName]});`);
        console.log(bg_cats[catName]);
        
        category.forEach(card => {
            let cardDom = document.createElement('div');
            cardDom.classList.add('warsieCard');
            
            let nameValue = '';
            if(catName === 'films'){
                nameValue = card.title;
            } else {
                nameValue = card.name;
            }
            cardDom.innerHTML = `
                    <p class="warsieCard_numLetters">${nameValue.split(' ').join('').length} letters</p>
                    <h3>${nameValue}</h3>
                ` 
            parent.appendChild(cardDom);
        })
    }

    addListeners = () => {
        this.selectCategoriesDom.addEventListener('change', this.selectElement)
    }

    checkUrlParams = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('cat')
    }

    getCatValue = async () => {

        let catValueIndex = '';

        // 1 - Definimos si la variable categría la cogemos por url

        if(this.checkUrlParams() === null){
            //Cambiamos el indice del select a 0
            this.selectCategoriesDom.options[0].selected = true;

            //Devolvemos el valor del índice
            catValueIndex = this.selectCategoriesDom.value;

        // 2- o por evento
        } else {
            catValueIndex = await this.checkUrlParams();
            let optionsArray = []
            let selectLength = this.selectCategoriesDom.length;
            for(let i=0; i<selectLength; i++){
                if(this.selectCategoriesDom.options[i].text === catValueIndex){
                    this.selectCategoriesDom.options[i].selected = true;
                }
            }
        }

        return catValueIndex
    }

    initWarsipedia = async () => {
        this.addListeners()
        await this.getCategories()
        let catValueIndex = await this.getCatValue();

        //recuperamos array desde la API según la categoría
        const arrCats = await this.loadCategorySelection(catValueIndex);  
        
        // Mostramos el resultado en las cajas
        await this.showCategoryResult(arrCats, catValueIndex)
    }
}

const warsiepedia = new Warsiepedia('categorySelector');

window.addEventListener('load', warsiepedia.initWarsipedia)