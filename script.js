import { updateGround, setupGround } from './ground.js'
import { updateDino, setupDino, getDinoCollisionBox, setDinoLose } from './dino.js';
import { updateCactus, setupCactus, getCactusCollisionBox } from './cactus.js';
import { persistScore, initPreviousScoreElement } from './prevScore.js';

//world is 100 units wide and 30 units tall
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001
const scoreElem = document.querySelector('[data-score]')
const worldElem = document.querySelector('[data-world]');
const startScreenElem = document.querySelector('[data-start-screen]');

//initialise the scale for the pixels and world size units
setPixelToWorldScale()

//when the window is resized reset the pixel to world unit size
window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime;
let speedScale;
let score;

function update(time) {

    if (lastTime === null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }

    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    if (checkLose()) return handleLose();
    lastTime = time;
    window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}

// gain 1 point per 100ms
function updateScore(delta) {
    score += delta * 0.01;
    scoreElem.textContent = "Score: " + Math.floor(score);
}

//calculate the world game size based on the current window size
function setPixelToWorldScale() {

    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    }
    else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    }
    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

function handleLose() {
    setDinoLose();
    persistScore(score);

    //wait 100ms before allowing the user to restart the game to avoid accidentally restarts
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenElem.classList.remove("hide");
    }, 100)
}

//checks for collisions between the dino and cactuses
function checkLose() {
    const dinoRect = getDinoCollisionBox();
    return getCactusCollisionBox().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
}

function handleStart() {
    lastTime = null;
    score = 0
    speedScale = 1;
    startScreenElem.classList.add("hide");
    initPreviousScoreElement();
    setupGround();
    setupDino();
    setupCactus();
    window.requestAnimationFrame(update)
}