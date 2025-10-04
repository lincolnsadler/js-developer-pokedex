const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const modalContainer = document.getElementById("modal-container");
const closeModalButton = document.getElementById("close-button");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                        .map((type) => `<li class="type ${type}">${type}</li>`)
                        .join("")}
                </ol>

                <img src="${pokemon.photo}"
                alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join("");
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

function showPokemonDetails(pokemon) {
    const modalContent = document.getElementById("modal-pokemon-content");
    modalContent.innerHTML = `
        <div class="modal-header">
            <span class="name">${pokemon.name}</span>
            <span class="number">#${pokemon.number}</span>
        </div>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <ol class="types">
            ${pokemon.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
        </ol>
        <div class="stats">
            <h3>Base Stats</h3>
            <ul>
                ${pokemon.stats
                    .map(
                        (stat) =>
                            `<li><span>${stat.name}</span> <span>${stat.base_stat}</span></li>`
                    )
                    .join("")}
            </ul>
        </div>
    `;
    const modal = document.querySelector(".modal-content");
    modal.className = `modal-content ${pokemon.type}`;
    modalContainer.classList.add("show");
}

function hideModal() {
    modalContainer.classList.remove("show");
}

pokemonList.addEventListener("click", (event) => {
    const pokemonCard = event.target.closest(".pokemon");
    if (pokemonCard) {
        const pokemonId = pokemonCard.dataset.id;
        pokeApi.getPokemonById(pokemonId).then(showPokemonDetails);
    }
});

closeModalButton.addEventListener("click", hideModal);

// Close modal if user clicks outside the content
modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
        hideModal();
    }
});

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
