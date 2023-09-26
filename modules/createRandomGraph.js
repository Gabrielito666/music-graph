module.exports = (min, max) => {
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