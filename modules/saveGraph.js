const sqliteExpress = require('sqlite-express');
const db = sqliteExpress.createDB('graphs.db');

module.exports = ( graph ) => {
    try {
        sqliteExpress.insert(db, 'graphs', graph);

        console.log('the graph is saved')
    }catch {
        console.log('has been an error... please try later')
    } 
}