const dijkstra = require('dijkstrajs');

const notesList = ['do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];
module.exports = async ( { graph, notes, random=true } ) => {
    const clipboardyModule = await import('clipboardy');
    const clipboardy = clipboardyModule.default;
    
    const [ n1, n2 ] = random ? [ notes, getRandomNote() ] : notes.split(' ');
    let arrayShortestPaht = dijkstra.find_path(graph, n1, n2)
    clipboardy.writeSync( JSON.stringify( arrayShortestPaht ) );
    console.log( arrayShortestPaht) ;

    function getRandomNote() {
        return notesList[ Math.floor(Math.random() * 12) ];
    }
}
