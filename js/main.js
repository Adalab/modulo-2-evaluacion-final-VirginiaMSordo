'use strict'

//QS
const characterListCards = document.querySelector('.js-characterlist__cards');
const favListCards = document.querySelector('.js-favlist__cards');
const searchName = document.querySelector('.js_search_input');
const form = document.querySelector('.js-form');



//VARIABLES/CONSTANTES GLOBALES

//esta variable se rellenará con los datos que vengan del JSON
let allCharacters = [];
let favourites = [];



//FUNCIONES

//1.primer paso: pintar la card de cada personajes con una función "pintadora" cogiendo, además, los datos del fichero JSON desde listado pintado en js. OneCharacter es una variable templete para añadirle la función que quiero luego replicar en otros sitos con otro parámetro. La función renderOneCard se le pasa parámetro ya que su variable inicial es local. 

function renderOneCard(oneCharacter) {
    return `<li>
    <article class="list__art js-list__art" id="${oneCharacter.char_id}">
        <img class="list__card--img" src="${oneCharacter.img}" alt="foto">
        <h3 class="list__card--title">${oneCharacter.name}</h3>
        <p class="list__card--description">${oneCharacter.status}</p>
    </article>  
</li>`;
    /*en vez de pintarlo en el html con characterListCard.innerhtml= lo que hago es decirle a la función renderCard que me devuelva RETURN lo que pinte y ya lo pinto yo en los sitios que corresponda.*/
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
    const selectArticlesList = document.querySelectorAll('.js-list__art');

    for (const eachArticle of selectArticlesList) {
        eachArticle.addEventListener('click', handleclickArticle);
    }
}

//para escuchar cuando pinchen en una personaje. Toggle click y desclik. 7. a mi array de personajes allCharacters le hago un find para que me busque los personajes clikados (función arrow con una variable donde me pondrá los resultados y la condición de lo que estoy buscando). La función find tiene un return implícito que me devuelve y es por eso que la guardo dentro de una constante, para guardar en ella el resultado de la búsqueda.Recordatorio, el id obtenido es un string, la propiedad "id" del currentTarget hay que pasarla a numero con ParseInt para poder llevar a cabo la comparacion, porque sino te compara el numero de "char_id" con el string de "id" udnefined, porque al ser esa comparacion false no mete nada dentro de la constante.

function handleclickArticle(event) {
    //atributo gancho al articulo para saber en que nave se hace click
    event.currentTarget.classList.toggle('selected');
    //busca de todo el listado los que tengan el id de búsqueda. find me devuelve todo el objeto y undefine sino lo encuentra.
    const findCharacters = allCharacters.find((eachCharacterId) => eachCharacterId.char_id === parseInt(event.currentTarget.id));

    //9.condicional para decir si ya lo tienes en fav no le hagas push de nuevo. Buscamos en el array de fav. igual que hemos buscado en el de todos los barcos pero con findIndex que me devolverá -1 (splice necesita número posición y no undifine) si no lo encuentra en la lista y será entonces cuando podré hacer push. si findInFavourites me devolvierá un barco no sería con un número y no lo pintaría pork ya sabe que está.
    const findInFavourites = favourites.findIndex((eachCharacterId) => eachCharacterId.char_id === parseInt(event.currentTarget.id));
    if (findInFavourites === -1) {
        //Ahora sino está metelo en la lista de fav.
        favourites.push(findCharacters);
    } else {
        //si ya está en fav, quítamelo. Splice le pongo la posición en la que empiezo y cuantos le quito.
        favourites.splice(findInFavourites, 1);

    }
    //pintamelo en el listado
    renderFavourites();
}

//8. pintamos favoritos con la misma función que pintamos todas las cards pero cambiando los parámetros, en esta no utilizamos parametro y por tanto llamamos directamente al array que queremos modificar dentro de la función. Si ponemos parametro, creamos un templete y por ello cuando llamemos a la función en otro lado, debemos añadirle el elemento sobre el que haremos la función entre paréntesis. Acordarse de llamar renderFavourites en la función handleclickArticle para que cuando pinche escuche y lo pinte en la lista.
function renderFavourites() {
    let html = '';
    for (let i = 0; i < favourites.length; i++) {
        html += renderOneCard(favourites[i]);
    }
    favListCards.innerHTML = html;
    //no añadimos listener porque estoy escuchando en el listado de todos. 

}

//llamo a la función para que pinte.A esta función le hace falta el array de todos los personajes allCharacters y la constante donde pintarlos characterListCards . 

renderAllCards(allCharacters);

//6. BUSCAR. Creamos evento en el input pero también en el formulario para que no desaparezca cuando recargue la pag y poder añadirle el preventdefault, también un submit para cuando se haga click en buscar no envíe formulario y recargue borrando todo. Añado class al form. //de mi lista de todos los personajes filtrame los que su nombre incluya lo que va escribiendo la usuaria con filter + includes.

form.addEventListener('submit', (event) => {
    event.preventDefault();
});

searchName.addEventListener('input', () => {
    const userSearch = searchName.value.toLowerCase();
    const filteredCharacters = allCharacters.filter((eachCharacter) => eachCharacter.name.toLowerCase().includes(userSearch));
    renderAllCards(filteredCharacters);
});


//3.Quiero que cargue los datos cuando cargue la página así que colocamos el fetch aquí. Completame el array de los personajes (allCharacters)con los datos de la Api y luego pintame todas las tarjetas.

fetch('https://breakingbadapi.com/api/characters')
    .then((response) => response.json())
    .then((jsonData) => {
        allCharacters = jsonData;
        renderAllCards(allCharacters);

    });






