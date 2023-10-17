const yugiohCardList = document.getElementById('yugioh-card-list');
const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
let yugiohCards = [];

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

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
            renderYuGiOhCards(yugiohCards);
        })
        .catch((error) => console.error(error));
}

function displayYuGiOhCardDetails(card) {
    const modalTitle = document.getElementById('yugiohCardModalLabel');
    const modalBody = document.getElementById('yugiohCardDetails');

    modalTitle.textContent = `Yu-Gi-Oh Card Details - ${card.name}`;

    modalBody.innerHTML = `
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
    cards.forEach((card) => {
        const cardElement = createYuGiOhCard(card);
        yugiohCardList.appendChild(cardElement);
    });
}

fetchYuGiOhCardData();
