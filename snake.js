const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let level = 1;
let gridSize = 160 / Math.pow(2, level);
let tileCount = canvas.width / gridSize;
let winCounts = 5;

let gameTimes = 0;

// const baseDirection = { x: 0, y: 0 };
let baseSpeed = 200;
let speedMultiplyFactor = 5;
let lastUpdateTime = 0

let isStarted = false


let snake;
let direction;
let food;
let score;
function gameLoop(timeStamp) {
    
    requestAnimationFrame(gameLoop);
    if(timeStamp - lastUpdateTime >= Math.max(50, baseSpeed - speedMultiplyFactor * score)){
        update();
        lastUpdateTime = timeStamp;
        gameTimes += timeStamp;
    }
    draw();
    // setTimeout(gameLoop, curSpeed);
}

function update() {
    
    if(score >= winCounts){
        alert('你赢了！目前关卡为:' + level + ',得分:' + score);
        if(level < 5){
            resetGame(++level);
        }
        else{
            //跳转到排行榜页面，展示游戏时间。
        }
        return;
    }

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const segments = snake.slice(1)
    // print(segments)

    // 检查是否撞墙或撞到自己
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || segments.some(segment => segment.x === head.x && segment.y === head.y)) {
        alert('游戏结束！得分: ' + score);
        resetGame();
        return;
    }

    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateAvoidPositions(snake);
    } else {
        snake.pop();
    }

}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {

        if(index == 0){
            console.log(segment)
            drawHead(segment)
            
            // ctx.fillStyle = 'lime';
            // ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }else{
            ctx.fillStyle = 'lime';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('关卡：' + level, 10, 20);
    ctx.fillText('得分: ' + score, 10, 40);
    ctx.fillText('胜利条件: ' + winCounts, 10, 60);
    ctx.fillText('时间:' + gameTimes, 10, 80);
}

function drawHead(head){
    const headX = head.x * gridSize;
    const headY = head.y * gridSize;
    ctx.fillStyle = 'lime'
    ctx.fillRect(head.x * gridSize, head.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = 'red'
    const eyeSize = gridSize / 6;

    let leftEyeX;
    let leftEyeY;

    let rightEyeX;
    let rightEyeY;
    if(direction.x === 0){
        leftEyeX = headX + gridSize * 0.25;
        rightEyeX = headX + gridSize * 0.75 - eyeSize;
        if(direction.y > 0){
            leftEyeY = rightEyeY =  headY + gridSize * 0.75 - eyeSize;
        }
        else{
            leftEyeY = rightEyeY = headY + gridSize * 0.25;
        }
    }
    else if(direction.y === 0){
        
        leftEyeY = headY + gridSize * 0.25;
        rightEyeY =  headY + gridSize * 0.75 - eyeSize;
        if(direction.x > 0){
            leftEyeX = rightEyeX = headX + gridSize * 0.75 - eyeSize;
        }
        else{
            leftEyeX = rightEyeX = headX + gridSize * 0.25;
        }
    }
    
    ctx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize); // 左眼
    ctx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize); // 右眼


}

function randomPosition(){
    return { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) }
}

function generateAvoidPositions(snake = []){
    let result = randomPosition();
    while(snake.some(segment => segment.x === result.x && segment.y === result.y)){
        result = randomPosition();
    }
    return result;
}

function resetGame(new_level = 1) {
    level = new_level
    gridSize = 160 / Math.pow(2, level);
    tileCount = canvas.width / gridSize;
    winCounts = 5 * level;
    score = 0;

    baseSpeed = 300 - (level-1) * 50;
    speedMultiplyFactor = 5 + level;


    snake = [randomPosition()];
    direction = {x:0, y:0};

    food = generateAvoidPositions(snake);
    
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});


resetGame()
requestAnimationFrame(gameLoop);