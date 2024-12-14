import fs from 'fs';
import fetch from 'node-fetch'; 
const URL = "https://pokeapi.co/api/v2/pokemon/";
const totalPokemons = 150;
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

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`La respuesta no es JSON para el Pokémon con ID ${i}. Respuesta: ${contentType}`);
        // Imprimir el contenido HTML recibido para entender el error
        const responseText = await response.text();
        console.error(`Contenido no JSON recibido para el Pokémon con ID ${i}:`, responseText);
        continue; 
      }

      try {
        // Intentar parsear la respuesta como JSON
        const data = await response.json();
        
        // Si los datos son válidos, agregamos el Pokémon
        if (data && data.name) {
          pokemons.push(data);
        } else {
          console.error(`Datos inválidos para el Pokémon con ID ${i}`);
        }
      } catch (error) {
        console.error(`Error al parsear JSON para el Pokémon con ID ${i}:`, error);

        // Intentar obtener y mostrar el contenido de la respuesta
        const responseText = await response.text();
        console.error(`Respuesta del servidor para el Pokémon con ID ${i}:`, responseText);

        // Guardar la respuesta como texto para depuración en lugar de JSON
        pokemons.push({ id: i, error: 'Error al parsear JSON', response: responseText });
      }
    }

    // Eliminar el archivo JSON si ya existe
    if (fs.existsSync('pokemons.json')) {
      fs.unlinkSync('pokemons.json');
      console.log('Archivo anterior eliminado.');
    }

    // Guardar los nuevos Pokémon en un archivo JSON con el mismo nombre
    const jsonData = JSON.stringify(pokemons, null, 2);
    console.log('Datos que se van a guardar en el archivo JSON: ', jsonData);  // Agregar una impresión antes de guardar
    fs.writeFileSync('pokemons.json', jsonData, 'utf8');
    console.log('Archivo JSON creado con el nombre "pokemons.json"');
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
  }
}

// Llamamos a la función para obtener los Pokémon
obtenerPokemons();
