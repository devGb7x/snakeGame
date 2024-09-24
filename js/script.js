const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); // linked js and html

// definition variables that will be changed on HTML
const score = document.querySelector('.score-value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

// direction snake and loopID
let direction;
let loopID;

// definition audio
const audio = new Audio("../assets/audio.mp3");
const audioFinal = new Audio("../assets/audioFinal.mp3");

const size = 30; // definition size

// definition home position to snake
const positionInitial = {
    x: 300, 
    y: 300
} 


const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min); // make random number, in inverval, include (max and min)
}

// generate a random position to food
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

// make a random color to food

const randomColor = () => {
    //definition variables of colors (definition the max and min => rgb)    
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
}

// make a snake
let snake = [positionInitial];

// add a food (points) to snake 

const increasePoints = () => {
    score.innerText = +score.innerText + snake.length;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}


const makeFood = (() => {
    ctx.shadowColor = food.color
    ctx.shadowBlur = 15.5;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 0;
})



// snake production
const makeSnake = () => {
    ctx.fillStyle = "#000";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = 'antiquewhite';
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

// move snake

const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1]

    if (direction == 'right') {
        snake.push({ x: head.x + size, y: head.y })
    }
    else if (direction == 'left') {
        snake.push({ x: head.x - size, y: head.y })
    }
    else if (direction == 'down') {
        snake.push({ x: head.x, y: head.y + size })
    }
    else if (direction == 'up') {
        snake.push({ x: head.x, y: head.y - size })
    }
    snake.shift()
}

// make a grid

const makeGrid = () => {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000';

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 600);
        ctx.lineTo(i, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(600, i);
        ctx.lineTo(0, i);
        ctx.stroke();
    };
}

//verify snake eat a food

const eatFood = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        snake.push(head);
        audio.play();
        increasePoints();

        // defining variables locals positions
        let x = randomPosition();
        let y = randomPosition();

        //verify loop position to food and snake
        while (snake.find((position) => position.x == x
            && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
}

// verify colision

const verifyColision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const p2Head = snake.length - 2;

    const colisionWall = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
    
    const autoColision = snake.find((position, index) =>{
        return index < p2Head && position.x == head.x && position.y == head.y  
    })

    if (colisionWall || autoColision){
        gameOver();
      // alert('error 404 !')
    }
}

// definition function game over 

const gameOver = () => {
    direction = undefined

    menu.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = 'blur(4px)';
    audioFinal.play();

    new gameLoop()
}

// create animation 

const gameLoop = () => {
    clearInterval(loopID);
    ctx.clearRect(0, 0, 600, 600);

    makeGrid(); // call the function makeGrid
    makeFood(); // call the function makeFood
    moveSnake(); // call the function moveSnake
    makeSnake(); // Call the function makeSnake 
    eatFood(); // call the function eatFood
    verifyColision(); // call the function verifyColision (game over)


    loopID = setInterval(() => {
        gameLoop();
    }, 200);
}

// move snake with keys (right, left, up, down)

document.addEventListener('keydown', ({ key }) => {
    if (key == 'ArrowRight' && direction != 'left') {
        direction = 'right'
    }
    if (key == 'ArrowLeft' && direction != 'right') {
        direction = 'left'
    }
    if (key == 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }
    if (key == 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }
});

// botton play again

buttonPlay.addEventListener('click', () => {
    // reset scoreboard and propertys

    score.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';

    // come back snake to position initial

    snake = [positionInitial];
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();


    direction = undefined;
    gameLoop();

})


gameLoop();
