import fs from 'fs';
import fetch from 'node-fetch'; 
const URL = "https://pokeapi.co/api/v2/pokemon/";
const totalPokemons = 1025;
const pokemons = [];

// Función para obtener los Pokémon
async function obtenerPokemons() {
  try {
    for (let i = 1; i <= totalPokemons; i++) {
      const response = await fetch(`${URL}${i}`);
      if (!response.ok) { 
        console.error(`Error al obtener el Pokémon con ID ${i}: ${response.statusText}`);
        continue; 
      }

      // Asegúrate de que la respuesta sea JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`La respuesta no es JSON para el Pokémon con ID ${i}`);
        continue; 
      }

      const data = await response.json();
      if (data && data.name) {
        pokemons.push(data);
      } else {
        console.error(`Datos inválidos para el Pokémon con ID ${i}`);
      }
    }

    // Guardar los nuevos Pokémon en un archivo JSON con el mismo nombre
    guardarEnJSON(pokemons);
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
  }
}

// Función para guardar los datos en el archivo JSON con el mismo nombre
function guardarEnJSON(data) {
  try {
    // Eliminar el archivo JSON si ya existe
    if (fs.existsSync('pokemons.json')) {
      fs.unlinkSync('pokemons.json');
      console.log('Archivo anterior eliminado.');
    }

    // Guardar los datos en el archivo JSON con el mismo nombre
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('pokemons.json', jsonData, 'utf8');
    console.log('Archivo JSON creado con el nombre "pokemons.json"');
  } catch (error) {
    console.error("Error al eliminar o crear el archivo JSON:", error);
  }
}

// Llamamos a la función para actualizar los Pokémon
obtenerPokemons();
