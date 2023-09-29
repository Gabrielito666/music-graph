const createRandomGraph = require( './modules/createRandomGraph' );
const saveGraph = require( './modules/saveGraph' );
const findShortestPaht = require( './modules/findShortestPath' );

const sqliteExpress = require( 'sqlite-express' );
const db = sqliteExpress.createDB( 'graphs.db' );
sqliteExpress.createTable( db, 'graphs', { name : 'text', graph : 'text' } );

class session{
    constructor(){
        this._graphSelected = null;
        this._graphList = [];
        this._questionList = [];
    }
    set graphSelected(value){
        this._graphSelected = value;
    }
    get graphSelected(){
        return this._graphSelected
    }
    set graphList(value){
        this._graphList = value;
    }
    get graphList(){
        return this._graphList
    }
    get questionList(){
        return this._questionList;
    }
    async selectGraphList(){
        let graphs = await sqliteExpress.select(db, 'graphs', '*');
        this._graphList = graphs === undefined ? [] : graphs ;
        this._graphList = Array.isArray( this._graphList ) ? this._graphList : [ this._graphList ];
    }
    pushGraph(graph){
        this._graphList.push(graph);
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
    pushOption(option){
        if(Array.isArray(option)){
            this.options = [...this.options, ...option];
        }else{
            this.options.push(option);
        }   
    }
}
class option{
    constructor( { next, action=()=>{}, alternative, close=false } ){
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
                question : 'This function is not already'
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
                    let arrRes = response.split(' ').map(Number)
                    thisSession._graphSelected = createRandomGraph( { min : arrRes[ 0 ], max : arrRes[ 1 ] } );
                }
            } ),
            saveGraphYes : new option( { next : 3 } ),          //go to createGraphName
            createGraphName : new option( {
                next : 0,                                       //go to main
                action : ( response ) => {
                    let theNewGraph = { name : response, graph : thisSession.graphSelected };
                    saveGraph( theNewGraph );
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
            options.returnMain,
            options.close
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
            questions.putTwoNotes                 // 9
        ] );
    } );
    return thisSession;
}

const inicializatedSession = inicialize();
module.exports = inicializatedSession;