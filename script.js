const yugiohCardList = document.getElementById('yugioh-card-list');
const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
let yugiohCards = [];
let currentPage = 1;
let numPages = 0;

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('prevPage').addEventListener('click', () => previousPage());
document.getElementById('nextPage').addEventListener('click', () => nextPage());

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCards = yugiohCards.filter((card) => card.name.toLowerCase().includes(searchTerm));
    renderYuGiOhCards(filteredCards);
}

function createYuGiOhCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const image = document.createElement('img');
    image.src = card.card_images[0].image_url;
    image.alt = card.name;
    image.classList.add('card-image'); // Added this line to apply styles

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = card.name;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    cardBody.appendChild(image);
    cardBody.appendChild(title);
    cardElement.appendChild(cardBody);

    cardElement.addEventListener('click', () => {
        displayYuGiOhCardDetails(card);
    });

    return cardElement;
}

function fetchYuGiOhCardData() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            yugiohCards = data.data;
            numPages = Math.ceil(yugiohCards.length / 51);
            renderYuGiOhCards(yugiohCards);
        })
        .catch((error) => console.error(error));
}

function displayYuGiOhCardDetails(card) {
    const modalTitle = document.getElementById('yugiohCardModalLabel');
    const modalBody = document.getElementById('yugiohCardDetails');

    modalTitle.textContent = `Yu-Gi-Oh Card Details - ${card.name}`;

    modalBody.innerHTML = `
        <img src="${card.card_images[0].image_url}" alt="${card.name}" class="card-image">
        <p>Type: ${card.type}</p>
        <p>Attribute: ${card.attribute}</p>
        <p>Level/Rank: ${card.level}</p>
        <p>Attack: ${card.atk}</p>
        <p>Defense: ${card.def}</p>
        <p class="card-description">${card.desc}</p>
    `;

    $('#yugiohCardModal').modal('show');
}

function renderYuGiOhCards(cards) {
    yugiohCardList.innerHTML = '';
    const startIndex = (currentPage - 1) * 51;
    const endIndex = startIndex + 51;
    const paginatedCards = cards.slice(startIndex, endIndex);

    paginatedCards.forEach((card) => {
        const cardElement = createYuGiOhCard(card);
        yugiohCardList.appendChild(cardElement);
    });
}

function previousPage() {
    currentPage--;
    if (currentPage < 1) {
        currentPage = numPages;
    }
    renderYuGiOhCards(yugiohCards);
}

function nextPage() {
    currentPage++;
    if (currentPage > numPages) {
        currentPage = 1;
    }
    renderYuGiOhCards(yugiohCards);
}

fetchYuGiOhCardData();
