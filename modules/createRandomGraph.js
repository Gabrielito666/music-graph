const notes = ['do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];
module.exports = ( { min, max } ) => {
  const grafo = {};
  notes.forEach(nota => {
    grafo[nota] = {};
    notes.forEach(notaAdyacente => {
      if (nota !== notaAdyacente) {
        const peso = Math.floor(Math.random() * (max - min + 1)) + min;
        grafo[nota][notaAdyacente] = peso;
      }
    });
  });

  console.log(grafo)
  
  return grafo;
}