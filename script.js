const yugiohCardList = document.getElementById('yugioh-card-list');
const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
let yugiohCards = [];
let currentPage = 1;
let numPages = 0;

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', realizarBusqueda);

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        realizarBusqueda();
    }
});

document.getElementById('prevPage').addEventListener('click', paginaAnterior);
document.getElementById('nextPage').addEventListener('click', paginaSiguiente);

function realizarBusqueda() {
    const términoDeBúsqueda = searchInput.value.toLowerCase();
    const cartasFiltradas = yugiohCards.filter((carta) => carta.name.toLowerCase().includes(términoDeBúsqueda));
    mostrarCartasYuGiOh(cartasFiltradas);
}

function crearCartaYuGiOh(carta) {
    const elementoCarta = document.createElement('div');
    elementoCarta.className = 'card';

    const imagen = document.createElement('img');
    imagen.src = carta.card_images[0].image_url;
    imagen.alt = carta.name;
    imagen.className = 'card-image';

    const título = document.createElement('h5');
    título.className = 'card-title';
    título.textContent = carta.name;

    const cuerpoCarta = document.createElement('div');
    cuerpoCarta.className = 'card-body';

    cuerpoCarta.appendChild(imagen);
    cuerpoCarta.appendChild(título);
    elementoCarta.appendChild(cuerpoCarta);

    elementoCarta.addEventListener('click', () => {
        mostrarDetallesCartaYuGiOh(carta);
    });

    return elementoCarta;
}

function obtenerDatosCartasYuGiOh() {
    fetch(apiUrl)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            yugiohCards = datos.data;
            numPages = Math.ceil(yugiohCards.length / 51);
            mostrarCartasYuGiOh(yugiohCards);
        })
        .catch((error) => console.error(error));
}

function mostrarDetallesCartaYuGiOh(carta) {
    const títuloModal = document.getElementById('yugiohCardModalLabel');
    const cuerpoModal = document.getElementById('yugiohCardDetails');

    títuloModal.textContent = `Detalles de la carta de Yu-Gi-Oh - ${carta.name}`;

    cuerpoModal.innerHTML = `
        <img src="${carta.card_images[0].image_url}" alt="${carta.name}" class="card-image">
        <p>Tipo: ${carta.type}</p>
        <p>Atributo: ${carta.attribute}</p>
        <p>Nivel/Rango: ${carta.level}</p>
        <p>Ataque: ${carta.atk}</p>
        <p>Defensa: ${carta.def}</p>
        <p class="card-description">${carta.desc}</p>
    `;

    $('#yugiohCardModal').modal('show');
}

function mostrarCartasYuGiOh(cartas) {
    yugiohCardList.innerHTML = '';
    const inicio = (currentPage - 1) * 51;
    const fin = inicio + 51;
    const cartasPaginadas = cartas.slice(inicio, fin);

    cartasPaginadas.forEach((carta) => {
        const elementoCarta = crearCartaYuGiOh(carta);
        yugiohCardList.appendChild(elementoCarta);
    });
}

function paginaAnterior() {
    currentPage--;
    if (currentPage < 1) {
        currentPage = numPages;
    }
    mostrarCartasYuGiOh(yugiohCards);
}

function paginaSiguiente() {
    currentPage++;
    if (currentPage > numPages) {
        currentPage = 1;
    }
    mostrarCartasYuGiOh(yugiohCards);
}

obtenerDatosCartasYuGiOh();
