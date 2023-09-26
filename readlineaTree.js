const createRandomGraph = require('./modules/createRandomGraph');
const saveGraph = require('./modules/saveaGraph');
const selectGraph = require();
const close = require();

const sqliteExpress = require('sqlite-express');
const db = sqliteExpress.createDB('graphs.db');

class session{
    constructor(){
        this._graphSelected;
        this._graphList = [];
        this._questionList = [];
    }
    set _graphSelected(value){
        this._graphSelected = value;
    }
    async selectGraphList(){
        this.graphList = await sqliteExpress.select(db, 'graphs', '*')
    }
    pushQuestion(question){
        if(Array.isArray(question)){
            this.questionList = [...this.questionList, ...question]
        }else{
            this.questionList.push(question)
        } 
    }
}
class question{
    constructor({question, alternativeDisplay = 'alphavet'}){
        this.question = question;
        this.alternativeDisplay = alternativeDisplay;
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
    constructor({ next, action=()=>{}, alternative }){
        this.next = next;
        this.action = action;
        this.alternative = alternative;
    }
}


const thisSession = new session();
thisSession.selectGraphList();
    
const mainQuestion = new question( {
    question : 'What do you want to do?:'
} );
const saveGraphQuestion = new question( { 
    question :  'Do you want save this?',
    alternativeDisplay : 'boolean'
} );
const createGraphNameQuestion = new question( {
    question : 'Create a name for this Graph:',
    alternativeDisplay : 'answer'
} );
const createManuaylGraphQuestion = new question( {
    question : 'This function is not already'
} );
const selectGraphQuestion = new question( {
    question : 'Select a Graph:',
    alternativeDisplay : 'numbers'
} );
const selectedGraphQuestion = new question( {
    question : 'What do you want to do with this graph?'
} );
const findRandomPathDestionQuestion = new question( {
    question : 'Do you want a random shortes path?',
    alternativeDisplay : 'boolean' 
} );
const putOneNoteQuestion = new question( {
    question : 'Please put the note you want start the shortest path:',
    alternativeDisplay : 'answer'
} );
const putTwoNotesQuestion = new question( {
    question : 'Please put the notes you want start and end the shortest path:',
    alternativeDisplay : 'answer'
} );

/*
    the value of next corresponds to the index of the question to which the choice of this
    alternative in the session.questionList array is directed.
*/

const optionCreateRandomGraph = new option( {
    next : 1,
    action : createRandomGraph,
    alternative : 'Create a random graph'
} );
const optionCreateManualyGraph = new option( {
    next : 3,
    alternative : 'Create a graph manually'
} );
const optionSelectGraph = new option( {
    next : 4,
    action : selectGraph,
    alternative : 'Select a graph'
} );


const optionSaveGraphDesition = new option( {
    next : 2
} );
const optionCreateGraphName = new option( {
    next : 0, //O crear un do you want return main menu
    action : saveGraph
} );

const optionRandomYes = new option( { next } )
const optionRandomNo = new option( { next } )

const optionFindShortestPaht = new option( { next } );
const optionFindRandomShortesPath = new option;
const optionFindEstrictShortesPath = new option;

const optionReturnMain = new option( { next, alternative : 'return to main menu' } );
const optionClose = new option( { next, action : close, alternative : 'Exit' } );

mainQuestion.pushOption( [optionCreateRandomGraph, optionCreateManualyGraph, optionSelectGraph, optionClose ] );
saveGraphQuestion.pushOption( [ optionSaveGraphDesition, optionReturnMain ] );
createGraphNameQuestion.pushOption( optionCreateGraphName );
createManuaylGraphQuestion.pushOption( [ optionReturnMain, optionClose ] );
selectGraphQuestion.pushOption(
    session.graphList.map(
        graph => new option( {
            next,
            action : ()=>{ session._graphSelected = graph.graph },
            alternative : graph.name 
        } )
    )
);
selectedGraphQuestion.pushOption( [ optionFindShortestPaht, optionReturnMain, optionClose ] );
findRandomPathDestionQuestion.pushOption( [ optionRandomYes, optionRandomNo ] );
putOneNoteQuestion.pushOption( optionFindRandomShortesPath );
putTwoNotesQuestion.pushOption( optionFindEstrictShortesPath );

/* This is the array which next refering */

session.pushQuestion( [
    mainQuestion,                       //0
    saveGraphQuestion,                  //1
    createGraphNameQuestion,            //etc...
    createManuaylGraphQuestion,
    selectGraphQuestion,
    selectedGraphQuestion,
    findRandomPathDestionQuestion,
    putOneNoteQuestion,
    putTwoNotesQuestion
] );


module.exports = thisSession;