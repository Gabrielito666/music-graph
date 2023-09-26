const sqliteExpress = require('sqlite-express');
const db = sqliteExpress.createDB('graphs.db')

module.exports = (graph) => {
    sqliteExpress.insert(db);

}