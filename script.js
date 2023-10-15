const yugiohCardList = document.getElementById('yugioh-card-list');
const apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php"; // Remove the "?num=24&offset=0" to get all cards

const searchInput = document.getElementById('search'); // Get the search input element
const pagination = document.getElementById('pagination');

const itemsPerPage = 300; // Number of items per page (changed to 5)
let yugiohCards = []; // To store the fetched Yu-Gi-Oh cards

// Function to create a Yu-Gi-Oh card
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

// Function to fetch Yu-Gi-Oh card data from the API
function fetchYuGiOhCardData() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            yugiohCards = data.data;
            renderPagination(yugiohCards);
            showPage(1, yugiohCards);

            searchInput.addEventListener('input', () => {
                filterYuGiOhCards(yugiohCards);
            });
        })
        .catch((error) => console.error(error));
}

// Function to display Yu-Gi-Oh card details in the modal
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
    `;

    $('#yugiohCardModal').modal('show');
}

// Function to filter Yu-Gi-Oh cards based on search input
function filterYuGiOhCards(cards) {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCards = cards.filter((card) => card.name.toLowerCase().includes(searchTerm));
    renderPagination(filteredCards);
    showPage(1, filteredCards);
}

// Function to render pagination
function renderPagination(cards) {
    pagination.innerHTML = '';
    const numPages = Math.ceil(cards.length / itemsPerPage);
    for (let i = 1; i <= numPages; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', () => showPage(i, cards));
        pagination.appendChild(li);
    }
}

// Function to show a specific page of cards
function showPage(pageNumber, cards) {
    yugiohCardList.innerHTML = '';
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageCards = cards.slice(startIndex, endIndex);
    pageCards.forEach((card) => {
        const cardElement = createYuGiOhCard(card);
        yugiohCardList.appendChild(cardElement);
    });
}

// Populate the Yu-Gi-Oh card list
fetchYuGiOhCardData();
