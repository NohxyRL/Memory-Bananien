
let game = {
    elCurrentScore: null,
    elHiscore: null,
    elWinScore: null,
    elBtnClear: null,
    elBtnPlayAgain: null,
    elDeck: null,
    elWinPanel: null,
    cardTypes: 10,
    arrCards: [],
    storageName: 'memory-hiscore',
    canPlay: true,
    firstCard: null,
    currentScore: 0,
    hiscore: 0,
    timer: null,
    showTime: 1000,
    foundPairs: 0,
    
};

function shuffleArray( arr ) {
    let currentIndex = arr.length - 1;

    while( currentIndex >= 0 ) {
        

    let randomIndex = Math.floor( Math.random() * currentIndex );
    
    [ arr[ currentIndex ], arr[ randomIndex ] ] = [ arr[ randomIndex ], arr[ currentIndex ] ];

    currentIndex --;
     
    }
    
} 

function getCardHTML( numeroCarte ) {

        /*
        <div class="card">
            <div class="image" style="background-image:url('./cards/card-[numeroCarte].jpg')"></div>
            <div class="back"></div>
        </div>
    */

        let elCard = document.createElement( 'div' );
        elCard.classList.add( 'card' );
        elCard.dataset.id = numeroCarte;
        
        //let innerCard = '<div class="image" style="background-image:url(\'./cards/card-[numeroCarte].jpg')"></div>'
        let innerCard = `<div class="image" style="background-image:url('./nouveau-carte/carte-${numeroCarte}.png')"></div>`;
        innerCard += '<div class="back"></div>';

        elCard.innerHTML = innerCard;

        elCard.addEventListener( 'click', handlerCardClick );

        return elCard;
        
}



function handlerCardClick( evt ) {
    let elCard = evt.target.offsetParent;

    if ( !game.canPlay ) {

        return;
    }

    clearTimeout( game.timer );

    let cardIsNotPlayable = elCard.classList.contains( 'flipped' );

    if ( cardIsNotPlayable ) {

        return;
    }

    elCard.classList.toggle( 'flipped' );

    let cardIsFirst = game.firstCard === null;

    if ( cardIsFirst ) {
        game.firstCard = elCard;

        return;
    }

    game.currentScore ++;

    game.elCurrentScore.textContent = game.currentScore;

    let cardIsDifferent = elCard.dataset.id !== game.firstCard.dataset.id;

    if ( cardIsDifferent ) {
        game.canPlay = false;  

        game.timer = setTimeout(function() {

            elCard.classList.remove( 'flipped' )

            game.firstCard.classList.remove( 'flipped' );

            game.firstCard = null;

            game.canPlay = true;    
        }, game.showTime );
        return;
    }

    game.firstCard = null;

    game.foundPairs ++;

    let allFound = game.foundPairs >= game.cardTypes;

    if( !allFound ) {
        return;
    }

    
    wonGame();



}





function initGame() {
    game.elCurrentScore = document.getElementById( 'the-score-display' );
    game.elHiscore = document.getElementById( 'the-hiscore-display' );
    game.elWinScore = document.getElementById( 'the-win-score-display' );

    game.elBtnClear = document.getElementById( 'the-clear-hiscore-button' );
    game.elBtnPlayAgain = document.getElementById( 'the-play-again-button' );

    game.elDeck = document.getElementById( 'the-deck' );
    game.elWinPanel = document.getElementById( 'the-win-panel' );

    game.elBtnClear.addEventListener( 'click', function(){
        console.log( 'Effacement de record...' );

        localStorage.removeItem( game.storageName );

        game.hiscore = 0;
        game.elHiscore.textContent = game.hiscore;
    } );

    game.elBtnPlayAgain.addEventListener( 'click', function(){
        newGame();
    } );

    let storedHiscore = localStorage.getItem( game.storageName );

    if( storedHiscore === null ) {
        storedHiscore = 0;
    }

    game.hiscore = storedHiscore
    game.elHiscore.textContent = game.hiscore;
    
    newGame();

}


function newGame() {
    console.log( 'Partie démarré...' );

    game.elDeck.innerHTML = '';
    game.arrCards = [];

    game.foundPairs = 0;

    for( let numeroCarte = 1; numeroCarte <= game.cardTypes; numeroCarte ++  ) {
        game.arrCards.push( numeroCarte, numeroCarte );
    } 


    shuffleArray( game.arrCards );

    for( let numeroCarte of game.arrCards ) {

        let elCard = getCardHTML( numeroCarte );

        game.elDeck.append( elCard );
    }

    game.currentScore = 0;
    game.elCurrentScore.textContent = game.currentScore;


    game.elWinPanel.classList.add( 'hidden' );

    game.elDeck.classList.remove( 'hidden' );

}

function wonGame() {
    game.elWinScore.textContent = game.currentScore;

    if( game.currentScore < game.hiscore || game.hiscore <= 0 ) {
        game.hiscore = game.currentScore;
        game.elHiscore.textContent = game.hiscore;

        localStorage.setItem( game.storageName, game.hiscore );

        
    }

    game.elDeck.classList.add( 'hidden' );

    game.elWinPanel.classList.remove( 'hidden' );
}
    


initGame();