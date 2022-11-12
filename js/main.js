'use strict'

//QS
const characterListCards = document.querySelector('.js-characterlist__cards');
const favListCards = document.querySelector('.js-favlist__cards');
const searchName = document.querySelector('.js_search_input');
const form = document.querySelector('.js-form');



//VARIABLES/CONSTANTES GLOBALES

//esta variable se rellenará con los datos que vengan del JSON
let allCharacters = [];
let favorites = [];



//FUNCIONES

//1.primer paso: pintar la card de cada personajes con una función "pintadora" cogiendo, además, los datos del fichero JSON desde listado pintado en js. OneCharacter es una variable templete para añadirle la función que quiero luego replicar en otros sitos con otro parámetro. La función renderOneCard se le pasa parámetro ya que su variable inicial es local. 

function renderOneCard(oneCharacter) {
    return `<li>
    <article class="list__art js-list__art">
        <img class="list__card--img" src="${oneCharacter.img}" alt="foto">
        <h3 class="list__card--title">${oneCharacter.name}</h3>
        <p class="list__card--description">${oneCharacter.status}</p>
    </article>  
</li>`;
    /*en vez de pintarlo en el html con characterListCard.innerhtml= lo que hago es decirle a la función renderCard que me devuelva RETURN lo que pinte y ya lo pinto yo.*/
}


//2. creo función pintadora de todos los personajes. Primero creo una variable vacía (la llamo html porque es lo que va a conter) y la asignaré al bucle para que me acumule ahí lo que vaya pintando.
//Luego bucle para pintar todos los personajes. La variable indice es la que nos irá dando los barcos de uno en uno del listado según su posición en el mismo indice. lo guardaremos en la variable html anterior. Luego añadiremos con innerhtml el html nuevo generado.

function renderAllCards(characters) {
    let html = '';
    for (let i = 0; i < characters.length; i++) {
        html += renderOneCard(characters[i]);
    }
    characterListCards.innerHTML = html;
    characterListeners();

}
//4.TAREA PARA FAVORITOS.asignamos a todos los articulos la clase de js para poder trabajar con ellos. Todos los artículos se crean después de hacer el bucle for, así que es ahí cuando tendremos que llamarlos con QS. Al ser querySelectorAll es un array de elementos, para hacer sobre allArticles un listener tenemos que recorrer todo allArticles con un for y así poder poner el listener en cada uno de ellos. Luego metemos la escuchadora dentro del bucle pintador para que se encargue el mismo de añadir los clicks.


function characterListeners() {
    const selectArticles = document.querySelectorAll('.js-list__art');

    for (const eachArticle of selectArticles) {
        eachArticle.addEventListener('click', handleclickArticle);
    }
}

//para escuchar cuando pinchen en una personaje
function handleclickArticle(event) {
    event.currentTarget.classList.toggle('selected');

}


//llamo a la función para que pinte.A esta función le hace falta el array de todos los personajes allCharacters y la constante donde pintarlos characterListCards pero como son variables globales de momento no hace falta pasarlo como parámetro. 
renderAllCards(allCharacters);

//6. BUSCAR. Creamos evento en el input pero también en el formulario para que no desaparezca cuando recargue la pag y poder añadirle el preventdefault, también un submit para cuando se haga click en buscar no envíe formulario y recargue borrando todo. Añado class al form.

form.addEventListener('submit', (event) => {
    event.preventDefault();
});

searchName.addEventListener('input', () => {
    const userSearch = searchName.value.toLowerCase();
    const filteredCharacters = allCharacters.filter((eachCharacter) => eachCharacter.name.toLowerCase().includes(userSearch));
    renderAllCards(filteredCharacters);
});


//de mi lista de todos los personajes filtrame los que su nombre incluya lo que va escribiendo la usuaria. 



//3.Quiero que cargue los datos cuando cargue la página así que colocamos el fetch aquí. Completame el array de los personajes (allCharacters)con los datos de la Api y luego pintame todas las tarjetas.

fetch('https://breakingbadapi.com/api/characters')
    .then((response) => response.json())
    .then((jsonData) => {
        allCharacters = jsonData;
        renderAllCards(allCharacters);

    });






