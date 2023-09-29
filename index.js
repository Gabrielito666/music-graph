#!/usr/bin/env node
const thisSession = require( './readlineaTree' );

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = rl;

function makeQuestion( question ){

    rl.question(
        formatQuestion( question.question, question.options, question.alternativeDisplay ),
        async (response) => {
            let thisOption
            if( question.alternativeDisplay === 'boolean' ){
                if( response === 'Y' || response === 'y' ){
                    thisOption = question.options[ 0 ]                  //if yes the fistr option
                }else if( response === 'N' || response === 'n' ){
                    thisOption = question.options[ 1 ]                  //if no, the second
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
                    thisOption = question.options[ indexOption ];
                }
            }
            else if( question.alternativeDisplay === 'numbers' ){
                let num = parseInt( response );
                if(
                    typeof num !== 'number' ||
                    num < 0 ||
                    !Number.isInteger( num ) ||
                    question.options.length < num
                ){
                    invalidResponse();
                }else{
                    thisOption = question.options[ num - 1 ];       //for the estetic "+ 1"
                }
            }
            else if( question.alternativeDisplay === 'answer' ){
                thisOption = question.options[ 0 ];
            }
            thisOption.action( response ); //we pass the response for the answer type
            if( thisOption.close ) {
                rl.close()
            }else{
                makeQuestion( (await thisSession).questionList[ thisOption.next ] )
            } 
        }
    )
}

function formatQuestion(question, options, alternativeDisplay){

    let stringOptions;
    if( alternativeDisplay === 'alphavet' || alternativeDisplay === 'numbers' ){
        const convert = alternativeDisplay === 'alphavet' ? true : false;
        stringOptions = options.map( 
            (op, index) => `${ convertLettersNumbers( index, false, convert ) } ) ${ op.alternative }`
        ).join('\n\t')
    }else{
        stringOptions = '';
    }

    return `${ question }${ alternativeDisplay === 'boolean' ? '(yes/no)' : '' }\n\t${ stringOptions }\n\n`
}
function convertLettersNumbers( input, toIndex, convert=true ) {
    if( convert ){
        const baseCharCode = 'a'.charCodeAt(0);
        if ( toIndex ) {
          return input.charCodeAt(0) - baseCharCode;
        } else {
          return String.fromCharCode( baseCharCode + input );
        }
    }else{
        return input + 1;           // just estetic
    }
}
function invalidResponse(){ console.log( 'This response is invalid, try again' ) };

( async ()=>{ makeQuestion( (await thisSession).questionList[ 0 ] ); } )();