const dijkstra = require('dijkstrajs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const notes = ['do', 'doS', 're', 'reS', 'mi', 'fa', 'faS', 'sol', 'solS', 'la', 'laS', 'si' ];

const pesoMinimo = 0;
const pesoMaximo = 10;

function findShortesPath(graph, n1, n2){

    dijkstra.find_path(graph, n1, n2)
}


rl.close();

function makeQuestion(question){

    rl.question(
        formatQuestion( question.question, question.options, question.alternativeDisplay ),
        (response) => {
            let thisOption
            if( question.alternativeDisplay === 'boolean' ){
                if( response === 'Y' || response === 'y' ){

                }else if( response === 'N' || response === 'n' ){

                }else{
                    invalidResponse();
                }
            }
            else if( question.alternativeDisplay === 'alphavet' ){
                if(
                    typeof response !== 'string' ||
                    response.length !== 1 ||
                    !/[a-z]/.test(response) ||
                    question.options.length < convertLettersNumbers( response, true )
                ){
                    invalidResponse();
                }else{
                    let indexOption = convertLettersNumbers( response, true );
                    thisOption = question.options[indexOption];
                }
            }
            else if( question.alternativeDisplay === 'numbers' ){
                let num = parseInt(response);
                if(
                    typeof num !== 'number' ||
                    num < 0 ||
                    !Number.isInteger(num) ||
                    question.options.length < num
                ){
                    invalidResponse();
                }else{
                    thisOption = question.options[num];
                }
            }
            else if( question.alternativeDisplay === 'answer' ){

            }
            thisOption.action(response); //we pass the response for the answer type
            makeQuestion(thisSession.questionList[thisOption.next]);
        }
    )
}

function formatQuestion(question, options, alternativeDisplay){

    let stringOptions;
    if( alternativeDisplay === 'alphavet' || 'numbers' ){
        const convert = alternativeDisplay === 'alphavet' ? true : false;
        stringOptions = options.map( 
            (op, index) => `${convertLettersNumbers( index, false, convert=true ) } ) ${op.alternative}`
        ).join('\n\t')
    }else{
        stringOptions = '';
    }

    return `
    ${question}${alternativeDisplay === 'boolean' ? '(yes/no)' : '' }
    
    ${stringOptions}
    `
}
function convertLettersNumbers(input, toIndex, convert) {
    if(convert){
        const baseCharCode = 'a'.charCodeAt(0);
        if (toIndex) {
          return input.charCodeAt(0) - baseCharCode;
        } else {
          return String.fromCharCode(baseCharCode + input);
        }
    }else{
        return input
    }
}
function invalidResponse(){ console.log( 'This response is invalid, try again' ) }