const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const shotsEl = document.getElementById('shots');
const timerEl = document.getElementById('timer');
const gameContainer = document.getElementById('game-container');
const powerBarContainer = document.getElementById('power-bar-container');
const powerBar = document.getElementById('power-bar');
const backgroundMusic = document.getElementById('background-music');
const muteButton = document.getElementById('mute-button');


const startMenu = document.getElementById('start-menu');
const gameOverMenu = document.getElementById('game-over-menu');
const pauseMenu = document.getElementById('pause-menu');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const resumeButton = document.getElementById('resume-button');
const pauseButton = document.getElementById('pause-button');
const exitToMainMenuButton = document.getElementById('ext');
const finalScoreEl = document.getElementById('final-score');


let canvasWidth, canvasHeight;
const scoreValues = { RED: 10, BLUE: 7, BLACK: 5, WHITE: 3 };
const GRAVITY = 0.15;
const MIN_POWER = 8;
const MAX_POWER = 65;
const CHARGE_RATE = 25;

let score = 0;
let shotsRemaining = 10;
let isGameOver = true;
let isPaused = false;
let arrow = null;
let gameTimer;
let shotTimerInterval;
let timeRemainingOnPause = 0;
let isCharging = false;
let chargePower = 0;
let isMusicPlaying = false;


const bow = { x: 100, y: 300, angle: 0 };
const target = {
    x: 850,
    y: 300,
    radii: { white: 80, black: 60, blue: 40, red: 20 },
    dy: 2,
    minY: 100,
    maxY: 500
};
const sun = { x: 500, y: 100, radius: 40 };


startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
resumeButton.addEventListener('click', togglePause);
exitToMainMenuButton.addEventListener('click', exitToMainMenu);
muteButton.addEventListener('click', toggleMute);
window.addEventListener('resize', resizeCanvas);

function setupMouseListeners(enable) {
    if (enable) {
        canvas.addEventListener('mousemove', aimBow);
        canvas.addEventListener('mousedown', startCharge);
        canvas.addEventListener('mouseup', shootArrow);
    } else {
        canvas.removeEventListener('mousemove', aimBow);
        canvas.removeEventListener('mousedown', startCharge);
        canvas.removeEventListener('mouseup', shootArrow);
    }
}


function toggleMute() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        muteButton.innerHTML = `<svg class="sound-icon" viewBox="0 0 100 100" fill="white" width="30" height="30">
            <path d="M20 35 L20 65 L40 65 L65 90 L65 10 L40 35 Z"/>
            <path d="M75 30 L85 20 M75 70 L85 80 M75 30 C80 40, 80 60, 75 70" stroke="white" stroke-width="8" fill="none"/>
        </svg>`;
    } else {
        backgroundMusic.play();
        muteButton.innerHTML = `<svg class="sound-icon" viewBox="0 0 100 100" fill="white" width="30" height="30">
            <path d="M20 35 L20 65 L40 65 L65 90 L65 10 L40 35 Z"/>
            <path d="M75 30 C80 40, 80 60, 75 70" stroke="white" stroke-width="8" fill="none"/>
            <path d="M85 20 C95 35, 95 65, 85 80" stroke="white" stroke-width="8" fill="none"/>
        </svg>`;
    }
    isMusicPlaying = !isMusicPlaying;
}


function initializeGame() {
    resizeCanvas();
    drawStaticElements();
    backgroundMusic.volume = 0.6;
}

function resizeCanvas() {
    canvasWidth = gameContainer.clientWidth;
    canvasHeight = gameContainer.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    bow.x = canvasWidth * 0.1;
    bow.y = canvasHeight / 2;
    target.x = canvasWidth * 0.85;
    target.minY = canvasHeight * 0.2;
    target.maxY = canvasHeight * 0.8;
    sun.x = canvasWidth * 0.6;
    sun.y = canvasHeight * 0.15;
    
    if (!isGameOver) {
        draw();
    } else {
         drawStaticElements();
    }
}


function startGame() {
    score = 0;
    shotsRemaining = 10;
    isGameOver = false;
    isPaused = false;
    arrow = null;
    
    updateUI();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    isMusicPlaying = true;

    startMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    pauseMenu.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    powerBarContainer.classList.remove('hidden');

    setupMouseListeners(true);
    resetShot();
    gameLoop();
}

function endGame() {
    isGameOver = true;
    setupMouseListeners(false);
    clearInterval(shotTimerInterval);
    cancelAnimationFrame(gameTimer);
    pauseButton.classList.add('hidden');
    powerBarContainer.classList.add('hidden');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isMusicPlaying = false;
    
    finalScoreEl.textContent = `YOUR SCORE ${String(score).padStart(2, '0')}`;
    gameOverMenu.classList.remove('hidden');
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;

    if (isPaused) {
        timeRemainingOnPause = parseFloat(timerEl.textContent);
        clearInterval(shotTimerInterval);
        cancelAnimationFrame(gameTimer);
        pauseMenu.classList.remove('hidden');
        setupMouseListeners(false);
        backgroundMusic.pause();
    } else {
        pauseMenu.classList.add('hidden');
        startShotTimer(timeRemainingOnPause);
        setupMouseListeners(true);
        gameLoop();
        backgroundMusic.play();
    }
}

function exitToMainMenu() {
    isGameOver = true;
    isPaused = false;

    clearInterval(shotTimerInterval);
    cancelAnimationFrame(gameTimer);
    setupMouseListeners(false);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isMusicPlaying = false;
    
    pauseMenu.classList.add('hidden');
    pauseButton.classList.add('hidden');
    powerBarContainer.classList.add('hidden');
    startMenu.classList.remove('hidden');

    drawStaticElements();
}

function gameLoop() {
    if (isGameOver || isPaused) return;
    update();
    draw();
    gameTimer = requestAnimationFrame(gameLoop);
}

function update() {
    if (isCharging) {
        chargePower += CHARGE_RATE * (1/60);
        if (chargePower > MAX_POWER) {
            chargePower = MAX_POWER;
        }
        updatePowerBar();
    }

    target.y += target.dy;
    if (target.y < target.minY || target.y > target.maxY) {
        target.dy *= -1;
    }

    if (arrow) {
        if (arrow.isStuck) {
            arrow.x = target.x + arrow.offsetX;
            arrow.y = target.y + arrow.offsetY;
        } else if (arrow.isFlying) {
            arrow.vy += GRAVITY;
            arrow.x += arrow.vx;
            arrow.y += arrow.vy;
            checkCollision();
            if (arrow.x > canvasWidth || arrow.y > canvasHeight || arrow.x < 0) {
                resetShot();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSun();
    drawTarget();
    drawBow();
    if (arrow) drawArrow();
}

function drawStaticElements() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSun();
}

function drawSun() {
    ctx.save();
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(sun.x + Math.cos(angle) * (sun.radius + 5), sun.y + Math.sin(angle) * (sun.radius + 5));
        ctx.lineTo(sun.x + Math.cos(angle) * (sun.radius + 20), sun.y + Math.sin(angle) * (sun.radius + 20));
        ctx.stroke();
    }
    ctx.restore();
}

function drawTarget() {
    const colors = { white: '#FFFFFF', black: '#000000', blue: '#007BFF', red: '#DC3545' };
    ['white', 'black', 'blue', 'red'].forEach(ring => {
        ctx.fillStyle = colors[ring];
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radii[ring], 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBow() {
    ctx.save();
    ctx.translate(bow.x, bow.y);
    ctx.rotate(bow.angle);

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 60, -Math.PI / 2.5, Math.PI / 2.5);
    ctx.stroke();

    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const bowTip1Y = 60 * Math.sin(-Math.PI / 2.5);
    const bowTip1X = 60 * Math.cos(-Math.PI / 2.5);
    const bowTip2Y = 60 * Math.sin(Math.PI / 2.5);
    const bowTip2X = 60 * Math.cos(Math.PI / 2.5);
    ctx.moveTo(bowTip1X, bowTip1Y);
    
    if (isCharging || (arrow && !arrow.isFlying && !arrow.isStuck)) {
        let pullback = (chargePower / MAX_POWER) * 25;
        ctx.lineTo(-pullback, 0); 
    }
      
    ctx.lineTo(bowTip2X, bowTip2Y);
    ctx.stroke();
    ctx.restore();
}

function drawArrow() {
    ctx.save();
    if (arrow.isStuck) {
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(arrow.hitAngle);
    } else if (arrow.isFlying) {
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(Math.atan2(arrow.vy, arrow.vx));
    } else {
        let pullback = (chargePower / MAX_POWER) * 25;
        ctx.translate(bow.x, bow.y);
        ctx.rotate(bow.angle);
        ctx.translate(-pullback, 0);
    }

    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();

    ctx.fillStyle = '#120902';
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(20, -5);
    ctx.lineTo(20, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function aimBow(event) {
    if (isPaused || isCharging || (arrow && arrow.isStuck)) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let angle = Math.atan2(mouseY - bow.y, mouseX - bow.x);

    if (angle > Math.PI / 2) {
        angle = Math.PI / 2;
    } else if (angle < -Math.PI / 2) {
        angle = -Math.PI / 2;
    }
    bow.angle = angle;
}

function startCharge(event) {
    if (!arrow || arrow.isFlying || arrow.isStuck || isPaused) return;
    isCharging = true;
    chargePower = MIN_POWER;
}

function shootArrow() {
    if (!isCharging || !arrow || arrow.isFlying || isPaused) return;
    
    isCharging = false;
    clearInterval(shotTimerInterval);

    arrow.isFlying = true;
    arrow.vx = Math.cos(bow.angle) * chargePower;
    arrow.vy = Math.sin(bow.angle) * chargePower;

    shotsRemaining--;
    updateUI();
    
    chargePower = 0;
    updatePowerBar();
}

function checkCollision() {
    if (!arrow || !arrow.isFlying) return;

    const dx = arrow.x - target.x;
    const dy = arrow.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < target.radii.white) {
        arrow.isFlying = false;
        arrow.isStuck = true;
        arrow.offsetX = dx;
        arrow.offsetY = dy;
        arrow.hitAngle = Math.atan2(arrow.vy, arrow.vx);
        
        let points = 0;
        if (distance <= target.radii.red) points = scoreValues.RED;
        else if (distance <= target.radii.blue) points = scoreValues.BLUE;
        else if (distance <= target.radii.black) points = scoreValues.BLACK;
        else points = scoreValues.WHITE;

        score += points;
        updateUI();
        
        setTimeout(resetShot, 700);
    }
}

function resetShot() {
    if (shotsRemaining <= 0) {
        endGame();
        return;
    }

    arrow = { x: bow.x, y: bow.y, vx: 0, vy: 0, isFlying: false };
    chargePower = 0;
    updatePowerBar();
    isCharging = false;
    startShotTimer(5.0);
}

function startShotTimer(startTime) {
    clearInterval(shotTimerInterval);
    let timeLeft = startTime;
    timerEl.textContent = timeLeft.toFixed(1);

    shotTimerInterval = setInterval(() => {
        if (isPaused || isCharging || (arrow && arrow.isStuck)) return;

        timeLeft -= 0.1;
        timerEl.textContent = timeLeft.toFixed(1);
        
        if (timeLeft <= 0) {
            clearInterval(shotTimerInterval);
            shotsRemaining--;
            updateUI();
            resetShot();
        }
    }, 100);
}

function updateUI() {
    scoreEl.textContent = `SCORE ${String(score).padStart(2, '0')}`;
    shotsEl.textContent = `SHOTS REMAIN ${shotsRemaining}`;
}

function updatePowerBar() {
    const powerPercentage = ((chargePower - MIN_POWER) / (MAX_POWER - MIN_POWER)) * 100;
    powerBar.style.width = `${Math.max(0, powerPercentage)}%`;
}
initializeGame();