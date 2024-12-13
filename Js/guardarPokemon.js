import fs from 'fs';
import fetch from 'node-fetch'; 
const URL = "https://pokeapi.co/api/v2/pokemon/";
const pokemons = [];
const totalPokemons = 1025;

// Función para obtener la cantidad total de Pokémon
/*async function obtenerTotalPokemons() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data.count; // Retorna la cantidad total de Pokémon
  } catch (error) {
    console.error("Error al obtener el total de Pokémon:", error);
    return 0; // En caso de error, retorna 0
  }
}*/


async function obtenerPokemons() {
  try {
    /*const totalPokemons = await obtenerTotalPokemons(); // Obtenemos el total de Pokémon
    console.log(`Total de Pokémon a obtener: ${totalPokemons}`);*/

    for (let i = 1; i <= totalPokemons; i++) {
      const response = await fetch(`${URL}${i}`);
      if (!response.ok) { 
        console.error(`Error al obtener el Pokémon con ID ${i}: ${response.statusText}`);
        continue; 
      }
      const data = await response.json();
      pokemons.push(data); 
    }

    // Sobrescribir el archivo JSON con los datos actualizados
    guardarEnJSON(pokemons);
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
  }
}

// Función para guardar los datos en el archivo JSON
function guardarEnJSON(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convierte el arreglo a un JSON con formato
  fs.writeFileSync('./pokemons.json', jsonData, 'utf8'); // Sobrescribe el archivo JSON
  console.log('Archivo JSON actualizado con nuevos Pokémon');
}

// Llamamos a la función para actualizar los Pokémon
obtenerPokemons();