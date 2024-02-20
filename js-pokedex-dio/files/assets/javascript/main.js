// Seleciona o elemento da lista de Pokémon e o botão "Carregar Mais" pelo ID
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

// Definições de limites e offsets para a API e a lista de Pokémon
const maxRecords = 151;
const limit = 10;
let offset = 0;

// Função para converter detalhes do Pokémon em um elemento de lista HTML
function convertPokemonToLi(pokemon){
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="details">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt='${pokemon.name}'>
            </div>
        </li>
    `;
}

// Função para carregar os Pokémon na lista
function loadPokemonItems(offset, limit){
    // Chama a função getPokemons da pokeApi para obter os Pokémon
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Converte os detalhes do Pokémon em elementos de lista HTML e junta-os
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        // Adiciona os elementos HTML à lista existente
        pokemonList.innerHTML += newHtml;

        // Após adicionar os elementos, atribui eventos de clique a cada um deles
        const items = document.querySelectorAll('.pokemon');
        items.forEach(item => {
            // Adiciona um ouvinte de evento de clique a cada item
            item.addEventListener('click', function() {
                const pokemon = pokemons.find(p => p.name === this.querySelector('.name').textContent);
                openOverlay(pokemon);
            });
        });
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Função para abrir o overlay com os detalhes do Pokémon
function openOverlay(pokemon) {
    const overlayImage = document.getElementById('overlayImage');
    const overlayName = document.getElementById('overlayName');
    const overlayDetails = document.getElementById('overlayDetails');
    const overlayWeight = document.getElementById('overlayWeight');
    const overlayHeight = document.getElementById('overlayHeight');
    const overlayAbilities = document.getElementById('overlayAbilities');

    overlayImage.src = pokemon.photo;
    overlayName.innerHTML = capitalizeFirstLetter(pokemon.name);
    overlayDetails.innerHTML = `<strong>Number:</strong> ${pokemon.number}, <strong>Type:</strong> ${pokemon.type}`;
    overlayWeight.innerHTML = pokemon.weight ? `<strong>Weight:</strong> ${pokemon.weight}` : 'Weight: N/A';
    overlayHeight.innerHTML = pokemon.height ? `<strong>Height:</strong> ${pokemon.height}` : 'Height: N/A';
        const formattedAbilities = pokemon.abilities.map(ability => ability.charAt(0).toUpperCase() + ability.slice(1)).join(', ');
    overlayAbilities.innerHTML = `<strong>Abilities:</strong> ${formattedAbilities}`;

    overlay.className = 'overlay ' + pokemon.type.toLowerCase();    

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('overlay').classList.add('active');

    document.getElementById('overlay').style.fontFamily = "'Oswald', sans-serif";
    document.getElementById('overlayDetails').style.fontFamily = "'Oswald', sans-serif";
    document.getElementById('overlayWeight').style.fontFamily = "'Oswald', sans-serif";
    document.getElementById('overlayHeight').style.fontFamily = "'Oswald', sans-serif";
    document.getElementById('overlayAbilities').style.fontFamily = "'Oswald', sans-serif";
}

function closeOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    document.getElementById('overlay').classList.remove('active');
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordWithNextPage = offset + limit;
    if (qtdRecordWithNextPage >= maxRecords){
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});
