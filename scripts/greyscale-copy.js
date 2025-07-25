const GRID_SIZE = 8;
const NUM_SQUARES = GRID_SIZE*GRID_SIZE;

const COLORS = ['white', 'grey', 'black'];
const CURRENT_GAME = {};

let targetGrid = [];
generateTargetGrid();

const interactiveGrid = document.getElementById('interactive-grid');
const staticGrid = document.getElementById('static-grid');

interactiveGrid.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

for (let i = 0; i < NUM_SQUARES; i++){
    const newSquare = document.createElement('div');
    newSquare.dataset.colorIndex = 0;
    newSquare.style.backgroundColor = COLORS[0];
    newSquare.classList.add('interactive-square');
    
    newSquare.addEventListener('mousedown', (event) => {
        let change = 1;
        if (event.button == 0){
            change = 1;
        } else if (event.button == 2) {
            change = -1;
        } else {
            change = 0;
        }
        let currentIndex = parseInt(newSquare.dataset.colorIndex);
        currentIndex = (currentIndex + change + COLORS.length) % COLORS.length;
        newSquare.dataset.colorIndex = currentIndex;
        newSquare.style.backgroundColor = COLORS[currentIndex];
        checkSolution();
    });

    interactiveGrid.appendChild(newSquare);

    const newSquareStatic = document.createElement('div')
    newSquareStatic.dataset.colorIndex = targetGrid[i];
    newSquareStatic.style.backgroundColor = COLORS[newSquareStatic.dataset.colorIndex];
    newSquareStatic.classList.add('static-square');
    staticGrid.appendChild(newSquareStatic);
}

const startButton = document.getElementById('start-button');
const nameElement = document.getElementById('name-input');
startButton.onclick = () => {
    const name = nameElement.value.trim();
    if (name === '') {
        alert('Please enter your name before starting')
    } else {
        newGame();
    }
};

function generateTargetGrid(){
    targetGrid = [];
    for (let i = 0; i < NUM_SQUARES; i++){
        let index = i;
        targetGrid[index] = Math.floor(Math.random() * COLORS.length);
    };
}

function checkSolution(){
    for (let i = 0; i < NUM_SQUARES; i++){
        if (interactiveGrid.children[i].dataset.colorIndex != targetGrid[i]){
            return false
        }
    };
    console.log("SOLVED!")
    CURRENT_GAME.endTime = Date.now();
    const finishTimeInMiliseconds = CURRENT_GAME.endTime - CURRENT_GAME.startTime;
    console.log(finishTimeInMiliseconds);
    document.getElementById('time-display').textContent = finishTimeInMiliseconds/1000;
    const name = document.getElementById('name-input').value;
    const hashInput = createHashInputString("greyscale-copy", name, finishTimeInMiliseconds);
    generateHash(hashInput).then(hash => {
        const truncatedHash = truncateHash(hash);
        document.getElementById('hash-display').textContent = truncatedHash;
        setTimeout(() => {
            alert(`Congratulations ${name}, you have finished with a time of ${finishTimeInMiliseconds/1000} seconds. Your session ID is ${truncatedHash}. Make sure to include the board, your name, your time, and your session ID in your screenshot.`);
        }, 100); 
    });
    return true
}

function newGame() {
    CURRENT_GAME.startTime = Date.now();
    console.log(CURRENT_GAME.startTime);
    resetGrids();
    document.getElementById('time-display').textContent = 'in progress';
}

function resetGrids() {
    generateTargetGrid();
    Array.from(document.getElementsByClassName('static-square')).forEach((element, index) => {
        element.dataset.colorIndex = targetGrid[index];
        element.style.backgroundColor = COLORS[element.dataset.colorIndex];
    });
    Array.from(document.getElementsByClassName('interactive-square')).forEach((element, index) => {
        element.dataset.colorIndex = 0;
        element.style.backgroundColor = COLORS[element.dataset.colorIndex];
    });
}