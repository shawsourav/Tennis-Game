
let canvas;
let canvasContext;

let ballX = 50;
let ballSpeedX = 10;
let ballY = 50;
let ballSpeedY = 4;

let player1Y = 250;
let player2Y = 250;

let player1Score = 0;
let player2Score = 0;
let showWinningScreen = false;

const PLAYER_HEIGHT = 100;
const PLAYER_THICKNESS = 10;
const WINNING_SCORE = 2;

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    let fps = 30;
    setInterval(startGame, 1000 / fps);
    canvas.addEventListener("mousedown", handleMouseClick);
    canvas.addEventListener("mousemove", function (evt) {
        let mousePos = calculateMousePos(evt);
        player1Y = mousePos.y - PLAYER_HEIGHT / 2;
    })
}

function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick(evt) {
    if (showWinningScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinningScreen = false;
    }
}

function startGame() {
    move();
    drawEverything();
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showWinningScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function autoPlayerMovement() {
    let player2Center = player2Y + PLAYER_HEIGHT / 2;
    if (player2Center < (ballY - 35)) {
        player2Y = player2Y + 6;
    } else if (player2Center > (ballY + 35)) {
        player2Y = player2Y - 6;
    }
}

function move() {
    if (showWinningScreen) {
        return;
    }
    autoPlayerMovement();
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
    if (ballX <= 0) {
        if (ballY > player1Y && ballY < player1Y + PLAYER_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (player1Y + PLAYER_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            ballReset();
            player2Score++;
        }
    }
    if (ballX > canvas.width) {
        if (ballY > player2Y && ballY < player2Y + PLAYER_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (player2Y + PLAYER_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            ballReset();
            player1Score++;
        }
    }
    if (ballY > canvas.height || ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }

}

function drawEverything() {
    //DRAW THE CANVAS
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinningScreen) {
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }

    drawNet();

    //LEFT PLAYER
    colorRect(0, player1Y, PLAYER_THICKNESS, 100, 'white');

    //RIGHT PLAYER
    colorRect(canvas.width - PLAYER_THICKNESS, player2Y, PLAYER_THICKNESS, 100, 'white');

    //BALL
    colorCircle(ballX, ballY, 10, 'white');

    //SCORE SHEET
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);

}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 30) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}