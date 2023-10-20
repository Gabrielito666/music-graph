module.exports = ( sqliteExpress, graph ) => {
    try {
        sqliteExpress.insert( { row : graph } );
        console.log('the graph is saved')
    }catch {
        console.log('has been an error... please try later')
    } 
}