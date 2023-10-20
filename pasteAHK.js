// copy-if-not-exist.js
const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( rootRoute ) => {
    const sourcePath = path.join( rootRoute, 'forMusescore.ahk' );
    const destinationPath = path.join( process.cwd(), 'miarchivo.ahk' );
    if ( !fs.existsSync( destinationPath ) ) fs.copyFileSync( sourcePath, destinationPath );
    
}
