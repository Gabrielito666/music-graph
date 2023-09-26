const dijkstra = require('dijkstrajs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const notes = ['do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];

const pesoMinimo = 0;
const pesoMaximo = 10;

function createRandomGraph(min, max) {
    const grafo = {};
    notasMusicales.forEach(nota => {
      grafo[nota] = {};
      notasMusicales.forEach(notaAdyacente => {
        if (nota !== notaAdyacente) {
          const peso = Math.floor(Math.random() * (max - min + 1)) + min;
          grafo[nota][notaAdyacente] = peso;
        }
      });
    });
    return grafo;
}



function findShortesPath(graph, n1, n2){

    dijkstra.find_path(graph, n1, n2)
}

rl.question('what do you want to do?:\n\ta) Create a random graph\n\tb) Create a graph manually\n\tc) Select a graph', (respuesta) => {
    console.log(`Ingresaste: ${respuesta}`);
    rl.close();
});