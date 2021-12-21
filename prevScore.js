const prevScoreElem = document.querySelector('[data-prev-score]');
const localStorageKey = "dinoGame.previousScore";

//get previous score from local storage 
function loadPreviousScore() {
    return localStorage.getItem(localStorageKey);
}

//save score to local storage 
export function persistScore(score) {
    localStorage.setItem(localStorageKey, parseInt(score));
}

//set previous score
function setPreviousScore(prevScore) {
    const score = (prevScore !== null) ? prevScore : 0;
    prevScoreElem.textContent = 'Previous Score: ' + prevScore;
}

//load and set the previous score
export function initPreviousScoreElement() {
    const prevScore = loadPreviousScore();
    setPreviousScore(prevScore);
}

