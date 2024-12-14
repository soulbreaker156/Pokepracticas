const listapokemon = document.querySelector("#listapokemon");
const botonesnav = document.querySelectorAll(".btheader");
const inputbuscar = document.querySelector("#buscar");
const botonbuscar = document.querySelector("#btnbuscar");
const pokemons = [];

let valorbuscar = '';


//Muestra todos los pokemons y los ordena en tarjetas
async function obtenerPokemons() {
  try{
   const response = await fetch('Js/pokemons.json');
    const data = await response.json();
     if (Array.isArray(data))  {
      pokemons.push(...data); // Agrega cada Pokémon al arreglo
      
        mostrarPokemons();
    }else{
      console.error("El archivo no tiene el formato esperado.");
    }
    
  }catch (error){
    console.error("Error al cargar el archivo JSON:", error);
  }
}

// Muestra los Pokémon ordenados
function mostrarPokemons() {
  // Ordena el arreglo por ID de menor a mayor
  pokemons.sort((a, b) => a.id - b.id);

  // Limpia el contenedor antes de mostrar los Pokémon
  const lista = document.querySelector('#listapokemon');
  lista.innerHTML = '';

  // Recorre y muestra los Pokémon
  pokemons.forEach(data => {
    mostrarPokemon(data);
  });
}
function mostrarPokemon(data) {

  let tipos = data.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p> `);
  tipos = tipos.join('');


  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `<div class="pokemon-imagen">
                    <img src=${data.sprites.other["official-artwork"].front_default} alt=${data.name}>
                </div>
                <div class="pokemon-info">
                  <div class="nombre-contenedor">
                    <p class="pokemon-id">#${data.id}</p>
                    <h2 class="pokemon-nombre">${data.name}</h2>
                  </div>
                  <div class="pokemon-tipos">
                    ${tipos}
                  </div> 
                  <div class="pokemon-stats">
                    <p class="altura stat">${data.height}m</p>
                    <p class="peso stat">${data.weight}kg</p>
                    <button class="detalles btn" data-id="${data.id}">Ver detalles</button>
                </div>
            </div> `;

  listapokemon.append(div);
  
  // Agregar evento al botón 
  div.querySelector('.detalles').addEventListener('click', async (event) => {
    const modal = document.getElementById('modal');
    const details = document.getElementById('pokemon-details');
    const pokemonId = Number(event.target.dataset.id);

    // Obtener los detalles del Pokémon y su cadena de evolución
    const pokemonDetails = await obtenerDetallesPokemon(pokemonId);
    const evolutionData = await obtenerEvoluciones(pokemonId);

    // Mostrar detalles del Pokémon en el modal
    details.innerHTML = `
      <strong>Nombre:</strong> ${pokemonDetails.name}<br>
      <strong>ID:</strong> #${pokemonDetails.id}<br>
      <strong>Altura:</strong> ${pokemonDetails.height}m<br>
      <strong>Peso:</strong> ${pokemonDetails.weight}kg<br>
      <strong>Evoluciones:</strong> ${evolutionData}<br>
    `;

    // Mostrar el modal
    modal.style.display = 'block';
  });

  // Cerrar el modal
  document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
  });

  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Función para obtener los detalles del Pokémon (incluyendo su nombre, altura, peso, etc.)
async function obtenerDetallesPokemon(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const data = await response.json();
    return data; // Retorna los detalles del Pokémon (nombre, altura, peso, etc.)
  } catch (error) {
    console.error("Error al obtener los detalles del Pokémon:", error);
    return {}; // En caso de error, retorna un objeto vacío
  }
}

// Función para obtener las evoluciones
async function obtenerEvoluciones(pokemonId) {
  try {
    //Obtener la información de la especie usando el ID del Pokémon
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const speciesData = await speciesResponse.json();

    // Verificamos si `evolution_chain` existe
    if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
      return "Evoluciones no disponibles";  // Si no hay cadena de evolución
    }

    //Obtener la URL de la cadena de evolución
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Obtener la cadena de evolución
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    // Procesar la cadena de evolución y obtener los nombres
    const evolutions = [];
    let current = evolutionData.chain;

    // Recorremos la cadena de evolución y obtenemos los nombres
    while (current) {
      evolutions.push(current.species.name);  // Solo añadimos el nombre de la especie
      current = current.evolves_to[0]; // Solo tomamos la primera evolución
    }

    // Retornamos la cadena de evoluciones como una lista de nombres
    return evolutions.join(' → ');
  } catch (error) {
    console.error("Error al obtener las evoluciones:", error);
    return "Evoluciones no disponibles";
  }
}


//Cuando se elige el tipo de pokemon desde el header
botonesnav.forEach(boton => boton.addEventListener("click", (event) => {
  const botonId = event.currentTarget.id;

  listapokemon.innerHTML = '';

  pokemons.forEach(data => {
    if (botonId == "vertodos") {
      mostrarPokemon(data);  // Muestra todos los Pokémon
    } else {
      const tipos = data.types.map(type => type.type.name);
      if (tipos.some(tipo => tipo.includes(botonId))) {
        mostrarPokemon(data);  // Muestra los Pokémon de un tipo específico
      }
    }
  });
}));

//funcion que realiza la busqueda por el id
botonbuscar.addEventListener('click', (event) => {
  const botonId = event.currentTarget.id;
  const input = inputbuscar.value;

  listapokemon.innerHTML = '';
  

  pokemons.forEach(data => {
    const id = data.id;
    const name = data.name;
    if (input == '' || input == id || input == name) {
      mostrarPokemon(data);  // Muestra el Pokémon que coincida con la búsqueda
    }
  });           
});

obtenerPokemons();