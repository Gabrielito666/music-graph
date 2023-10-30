const path = require('path');
const createRandomGraph = require( './modules/createRandomGraph' );
const saveGraph = require( './modules/saveGraph' );
const findShortestPaht = require( './modules/findShortestPath' );
const isAnObject = ( x ) => ( typeof x === 'object' && x !== null );

const SqliteExpress = require( 'sqlite-express' );
const sqliteExpress = new SqliteExpress();

sqliteExpress.defaultOptions.set( {
    rootPath : process.cwd(),
    route :'./graphs.db',
    key : 'graphs',
    table : 'graphs',
    db : 'graphs',
    emptyResult : [],
    processRows : false,
    logQuery : false
} );
sqliteExpress.createDB();
sqliteExpress.createTable( { columns : { name : 'text', graph : 'text' } } );

class session{
    constructor(){
        this._graphSelected = null;
        this._graphList = [];
        this._questionList = [];
    }
    set graphSelected( value ){
        this._graphSelected = value;
    }
    get graphSelected(){
        return this._graphSelected
    }
    set graphList( value ){
        this._graphList = value;
    }
    get graphList(){
        return this._graphList
    }
    get questionList(){
        return this._questionList;
    }
    async selectGraphList(){
        this._graphList = await sqliteExpress.select();
    }
    pushGraph( graph ){
        this._graphList.push( graph );
    }
    pushQuestion( question ){
        if( Array.isArray( question ) ){
            this._questionList = [ ...this._questionList, ...question ]
        }else{
            this._questionList.push( question )
        } 
    }
}
class question{
    constructor( { question, alternativeDisplay = 'alphavet' } ){
        this.question = question;
        this.alternativeDisplay = alternativeDisplay;
        this.options = []
    }
    pushOption( option ){
        if( Array.isArray( option ) ){
            this.options = [ ...this.options, ...option ];
        }else{
            this.options.push( option );
        }   
    }
}
class option{
    constructor( { next, action = () => {}, alternative, close = false } ){
        this.next = next;
        this.action = action;
        this.alternative = alternative;
        this.close = close;
    }
}

async function inicialize() {
    const thisSession = new session();
    await thisSession.selectGraphList().then( () => {
        const questions = {
            main : new question( {
                question : 'What do you want to do?:'
            } ),
            defineWeightRandomGraph : new question( {
                question : 'please enter the minimum and maximum weight that you want:',
                alternativeDisplay : 'answer'
            } ),
            saveGraphDesition : new question( { 
                question :  'Do you want save this?',
                alternativeDisplay : 'boolean'
            } ),
            createGraphName : new question( {
                question : 'Create a name for this Graph:',
                alternativeDisplay : 'answer'
            } ),
            createManuaylGraph : new question( {
                question : 'How do you want set your graph?:',
            } ),
            setWidthPath : new question( {          // 10 in questionList order
                question : 'Send the path of your Javascript module how exports a graph in Object format:',
                alternativeDisplay : 'answer'
            } ),
            setWidthJson : new question( {          // 11 in questionList order
                question : 'Send the graph in JSON format',
                alternativeDisplay : 'answer'
            } ),
            selectGraph : new question( {
                question : 'Select a Graph:',
                alternativeDisplay : 'numbers'
            } ),
            selectedGraphMain : new question( {
                question : 'What do you want to do with this graph?'
            } ),
            findRandomPathDestion : new question( {
                question : 'Do you want a random shortes path?',
                alternativeDisplay : 'boolean' 
            } ),
            putOneNote : new question( {
                question : 'Please put the note you want start the shortest path:',
                alternativeDisplay : 'answer'
            } ),
            putTwoNotes : new question( {
                question : 'Please put the notes you want start and end the shortest path:',
                alternativeDisplay : 'answer'
            } )
        }
    
        /*
            the value of next corresponds to the index of the question to which the choice of this
            alternative in the session.questionList array is directed.
        */
    
        const options = {
            createRandomGraphDesition : new option( {
                next : 1,                                       //go to defineWeightRandomGraph
                alternative : 'Create a random graph'
            } ),
            createGraph : new option( {
                next : 2,                                       //go to saveGraphDesition
                action : ( response )=> {
                    let arrRes = response.split( ' ' ).map( Number )
                    thisSession._graphSelected = createRandomGraph( { min : arrRes[ 0 ], max : arrRes[ 1 ] } );
                }
            } ),
            saveGraphYes : new option( { next : 3 } ),          //go to createGraphName
            createGraphName : new option( {
                next : 0,                                       //go to main
                action : ( response ) => {
                    let theNewGraph = { name : response, graph : thisSession.graphSelected };
                    saveGraph( sqliteExpress, theNewGraph );
                    thisSession.pushGraph( theNewGraph );
                    questions.selectGraph.pushOption( new option( {
                        next : 6,                                 //go to selectGaphMain
                        action : ()=>{ thisSession.graphSelected = theNewGraph.graph; },
                        alternative : theNewGraph.name
                    } ) )
                }
            } ),
            createManualyGraph : new option( {
                next : 4,                                       //go to createManualyGraph
                alternative : 'Create a graph manually'
            } ),
            putYourModulePaht : new option( {
                next : 10,                                      //setWidthPath
                alternative : 'Put the path of javacript module'
            } ),
            modulePathProcess : new option( {
                next : 2,                                       //go to saveGraphDesition
                action : async ( response ) => {
                    let rootRoute = process.cwd();
                    let completeRoute = path.join( rootRoute, response );
                    let responseModule = await require( completeRoute )
                    let dataImport = typeof responseModule === 'function' ? responseModule() : responseModule ;
                    if( isAnObject( dataImport ) ) {
                        thisSession._graphSelected = dataImport;
                        console.log( dataImport );
                    }
                    else throw new Error( 'Is not an Object' );
                }
            } ),
            putYourJsonGraph : new option( {
                next : 11,                                      //go to setWidthJson
                alternative : 'Paste a JSON'
            } ),
            jsonGraphProcess : new option( {
                next : 2,                                       //go to saveGraphDesition
                action : ( response )=>{
                    let parsedResponse = JSON.parse( response );
                    thisSession._graphSelected = parsedResponse;
                    console.log( parsedResponse );
                }
            } ),
            selectGraph : new option( {
                next : 5,                                       //go to selectGraph
                alternative : 'Select a graph'
            } ),
            findShortestPaht : new option( {
                next : 7,                                       //go to findRandomPathDesition
                alternative : 'Find a shortest path'
            } ),
            randomPathYes : new option( { next : 8 } ),         //go to putOneNote
            randomPathNo : new option( { next : 9 } ),          //go to putTwoNotes
            findRandomShortesPath : new option( {
                next : 6,                                       //go to selectGraphMain
                action : ( response ) => {
                    findShortestPaht( {
                        graph : thisSession._graphSelected,
                        notes : response,
                        random : true
                    } );
                }
            } ),                 
            findEstrictShortesPath : new option( {
                next : 6,                                       //go to selectGaphMain
                action : ( response ) => {
                    findShortestPaht( {
                        graph : thisSession._graphSelected,
                        notes : response,
                        random : false
                    } );
                }
            } ),
            logTheGraphSelected : new option( {
                next : 6,
                alternative : 'Log this grapf',
                action : () => { console.log( thisSession.graphSelected ) }
            } ),              
            returnMain : new option( {
                next : 0,                                       //go to main
                alternative : 'return to main menu'
            } ),
            close : new option( {
                next : 0,                  
                alternative : 'Exit',
                close : true                                    //end
            } )
        };
        questions.main.pushOption( [
            options.createRandomGraphDesition,
            options.createManualyGraph,
            options.selectGraph,
            options.close
        ] );
        questions.defineWeightRandomGraph.pushOption( options.createGraph );
        questions.saveGraphDesition.pushOption( [
            options.saveGraphYes,
            options.returnMain
        ] );
        questions.createGraphName.pushOption( options.createGraphName );
        questions.createManuaylGraph.pushOption( [
            options.putYourJsonGraph,
            options.putYourModulePaht
        ] );
        questions.selectGraph.pushOption(
            thisSession.graphList.map(
                graph => new option( {
                    next : 6,                                 //go to selectGaphMain
                    action : ()=>{ thisSession.graphSelected = graph.graph; },
                    alternative : graph.name 
                } )
            )
        );
    
        questions.selectedGraphMain.pushOption( [
            options.findShortestPaht,
            options.logTheGraphSelected,
            options.returnMain,
            options.close
        ] );
        questions.findRandomPathDestion.pushOption( [
            options.randomPathYes,
            options.randomPathNo
        ] );
        questions.putOneNote.pushOption( options.findRandomShortesPath );
        questions.putTwoNotes.pushOption( options.findEstrictShortesPath );


        questions.setWidthJson.pushOption( options.jsonGraphProcess );
        questions.setWidthPath.pushOption( options.modulePathProcess );
    
        /* This is the array which next refering */
    
        thisSession.pushQuestion( [
            questions.main,                       // 0
            questions.defineWeightRandomGraph,    // 1
            questions.saveGraphDesition,          // 2
            questions.createGraphName,            // 3
            questions.createManuaylGraph,         // 4
            questions.selectGraph,                // 5
            questions.selectedGraphMain,          // 6
            questions.findRandomPathDestion,      // 7
            questions.putOneNote,                 // 8
            questions.putTwoNotes,                // 9
            questions.setWidthPath,                //10
            questions.setWidthJson                 //11
        ] );
    } );
    return thisSession;
}

const inicializatedSession = inicialize();
module.exports = inicializatedSession;