const findShortestPath = require('./findShortestPath');
const notesList = [ 'do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];

const getAllPaths = async graph =>
{
    return await Promise.all(
        notesList.map(async note1 =>
        {
            await Promise.all(
                notesList.map(async note2 =>
                {
                    const notes = `${note1} ${note2}`;
                    return await findShortestPath({ graph, notes, random : false })
                })
            )
        })
    )
};
module.exports = getAllPaths;