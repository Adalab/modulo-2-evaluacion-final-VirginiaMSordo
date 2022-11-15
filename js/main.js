'use strict'

//---------------------------------QS-------------------------------------------

const characterListCards = document.querySelector('.js-characterlist__cards');
const favListCards = document.querySelector('.js-favlist__cards');
const searchName = document.querySelector('.js_search_input');
const buttonSearch = document.querySelector('.js-button-search');
const form = document.querySelector('.js-form');
const noResults = document.querySelector('.js-no-results');
const refresh = document.querySelector('.js-button-refresh');



//------------------VARIABLES/CONSTANTES GLOBALES-------------------------------

let allCharacters = [];
let favourites = [];



//-------------------------------------FUNCIONES--------------------------------

//--------------Pintadoras------------
/*Pintar la card de cada personajes.OneCharacter es una variable templete.*/

function renderOneCard(oneCharacter) {
    //12. Para favoritos buscamos y pintamos o despintamos según esté o no.
    const findInFavourites = favourites.findIndex((eachCharacterId) => eachCharacterId.char_id === parseInt(oneCharacter.char_id));

    let classFav = '';
    if (findInFavourites === -1) {
        classFav = '';
    } else {
        classFav = 'selected';
    }
    return `<li>
    <article class="list__art js-list__art ${classFav}" id="${oneCharacter.char_id}">
        <img class="list__card--img" src="${oneCharacter.img}" alt="foto">
        <h3 class="list__card--title">${oneCharacter.name}</h3>
        <p class="list__card--description">${oneCharacter.status}</p>
    </article>  
</li>`;

}

/*2.Función pintadora de todos los personajes.Siempre necesitará parámetro.*/

function renderAllCards(characters) {
    let html = '';
    characterListCards.innerHTML = '';
    for (let i = 0; i < characters.length; i++) {
        html += renderOneCard(characters[i]);
    }
    characterListCards.innerHTML = html;
    characterListeners();



}
renderAllCards(allCharacters);


function renderFavourites() {
    let html = '';
    for (let i = 0; i < favourites.length; i++) {
        html += renderOneCard(favourites[i]);
    }
    favListCards.innerHTML = html;

}

function paintFavDefault() {
    favListCards.innerHTML = ` <li class="list">
                        <article class="list__art js-list__art">
                            <img class="list__card--img" src="./img/choose.png" alt="foto">
                            <h3 class="list__card--title">Select your fav from the list</h3>
                        </article> 
                        
                    </li>`;
}

//--------------Resto de funciones--------------


/*para escuchar cuando pinchen en una personaje. */

function handleclickArticle(event) {
    event.currentTarget.classList.toggle('selected');
    //busca de todo el listado los que tengan el id de búsqueda. find me devuelve todo el objeto y undefine sino lo encuentra.

    const findCharacters = allCharacters.find((eachCharacterId) => eachCharacterId.char_id === parseInt(event.currentTarget.id));

    //9.condicional para decir si ya lo tienes en fav no le hagas push de nuevo. Buscamos en el array de fav. 
    const findInFavourites = favourites.findIndex((eachCharacterId) => eachCharacterId.char_id === parseInt(event.currentTarget.id));

    if (findInFavourites === -1) {
        favourites.push(findCharacters);
        localStorage.setItem('listStorage', JSON.stringify(favourites));
    } else {
        //si ya está en fav, quítamelo. 
        favourites.splice(findInFavourites, 1);
        localStorage.setItem('listStorage', JSON.stringify(favourites));
    }
    renderFavourites();
}
/*4.PARA FAVORITOS.Asignamos a todos los articulos la clase de js para poder trabajar con ellos.Recorremos el array para ponerle la clase a todos los art.*/
function characterListeners() {
    const selectArticlesList = document.querySelectorAll('.js-list__art');

    for (const eachArticle of selectArticlesList) {
        eachArticle.addEventListener('click', handleclickArticle);
    }
}


//13. botón refresh
function refreshFav() {
    paintFavDefault();
    localStorage.removeItem('listStorage', JSON.stringify(favourites));
    favourites = [];
    renderAllCards(allCharacters);

}




//-------------------------------------LISTENERS--------------------------------

form.addEventListener('submit', (event) => {
    event.preventDefault();
});

searchName.addEventListener('input', () => {
    const userSearch = searchName.value.toLowerCase();
    const filteredCharacters = allCharacters.filter((eachCharacter) => eachCharacter.name.toLowerCase().includes(userSearch));
    if (filteredCharacters.length === 0) {
        noResults.innerHTML = ('Lo siento, el usuario que has introducido no está registrado.');
    } else {
        noResults.innerHTML = '';
    }
    renderAllCards(filteredCharacters);
});

refresh.addEventListener('click', refreshFav);


//-------------------------CUANDO CARGUE LA PAG--------------------------------

fetch('https://breakingbadapi.com/api/characters')
    .then((response) => response.json())
    .then((jsonData) => {
        allCharacters = jsonData;
        renderAllCards(allCharacters);
        paintFavDefault();

    });

/*Si el usuario tiene favoritos guardados píntamelos*/
const savedFav = JSON.parse(localStorage.getItem('listStorage'));
//la primera vez que entro intenta pintar fav y no hay, dará null y por eso con el if decimos que si es null no pinte y así evitamos que de error.
if (savedFav !== null) {
    favourites = savedFav;
    renderFavourites();
    paintFavDefault();
}










