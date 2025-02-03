// Selecting Elements
const board = document.getElementById('game-board');
const restartButton = document.getElementById('restart-btn');
const flipSound = document.getElementById('flip-sound');
const winSound = document.getElementById('win-sound');

// Card Values (Cute Emojis)
const cardValues = ['🐰', '🐶', '🐱', '🦄', '🐼', '🐹', '🐥', '🐸'];
let cards = [...cardValues, ...cardValues];

// Shuffle Cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Game State
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// Create Cards
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = value;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Event Listener
    card.addEventListener('click', handleCardClick);

    return card;
}

// Handle Card Click
function handleCardClick() {
    if (lockBoard || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    flipSound.play();

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// Check for Match
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards();
        matchedPairs++;

        if (matchedPairs === cardValues.length) {
            setTimeout(() => {
                winSound.play();
                alert('🎉 Yay! You won! 🔵🔴');
            }, 500);
        }
    } else {
        unflipCards();
    }
}

// Disable Matched Cards
function disableCards() {
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);
    resetBoard();
}

// Unflip Non-Matching Cards
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset Board
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Initialize Game
function startGame() {
    board.innerHTML = '';
    matchedPairs = 0;
    shuffle(cards);

    cards.forEach(value => {
        const cardElement = createCard(value);
        board.appendChild(cardElement);
    });
}

// Restart Game
restartButton.addEventListener('click', startGame);

// Start the game when the page loads
startGame();
