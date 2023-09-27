const dijkstra = require('dijkstrajs');
const notesList = ['do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];
module.exports = ( { graph, notes, random=true } ) => {
    const [ n1, n2 ] = random ? [ notes, getRandomNote() ] : notes.split(' ');
    console.log( dijkstra.find_path(graph, n1, n2) );

    function getRandomNote() {
        return notesList[ Math.floor(Math.random() * 12) ];
    }
}
