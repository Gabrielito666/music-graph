const sqliteExpress = require( 'sqlite-express' );
const db = sqliteExpress.createDB( 'graphs.db' );

sqliteExpress.createTable( db, 'graphs', { name : 'text', graph : 'text' } );