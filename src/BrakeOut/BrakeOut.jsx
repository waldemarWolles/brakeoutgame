import React, { useEffect, useRef } from 'react';
import './../App.css';
import Collision from './Collision';
import Draw from './Draw';
import { Parameters } from './Parameters';
import gameOverSound from './../sounds/gameOver.wav';
import winGameSound from './../sounds/gameWin.ogg';
import objectHit from './../sounds/objectHit.wav';
import bg_music from './../sounds/bg_music.mp3';
import platformHit from './../sounds/platformHit.wav';
import lifeDecreasing from './../sounds/lifeDecreasing.wav';

const { ballParam, platformParam, brickParam, playerParam } = Parameters;

let bricks = [];
let gameOver = false;
let game = false;
let rightPressed = false;
let leftPressed = false;

// Platform controls
const keyDownHandler = (e) => {
    if (e.key === 'ArrowLeft' || e.key === "Left") {
        leftPressed = true;
        // platformParam.x -= 8;
    } else if (e.key === 'ArrowRight' || e.key === "Right") {
        rightPressed = true;
        // platformParam.x += 8;
    } else if (e.key === 'Enter') {
        startGame();
    }
}

const keyUpHandler = (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener('keyup', keyUpHandler);
document.addEventListener('keydown', keyDownHandler);


// Starting game condition
const startGame = () => {
    game = true;
}


const BrakeOut = () => {

    const canvasRef = useRef(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        platformParam.y = canvas.height - 30;
        ballParam.x = canvas.width / 2;
        ballParam.y = platformParam.y - ballParam.radius * 10;

        // Sounds
        const gameOverSound = document.getElementById('gameOverSound');
        const winGameSound = document.getElementById('winGameSound');
        const objectHit = document.getElementById('objectHit');
        objectHit.volume = .5;
        const bg_music = document.getElementById('bg_music');
        bg_music.volume = .5;
        const platformHit = document.getElementById('platformHit');
        platformHit.volume = 0.2;
        const lifeDecreasing = document.getElementById('lifeDecreasing');
        lifeDecreasing.volume = 0.1;


        // Creating bricks
        const createBricks = () => {
            brickParam.width = canvas.width / 10 - 11;
            for (let r = 0; r < brickParam.row; r++) {
                bricks[r] = [];
                for (let c = 0; c < brickParam.col; c++) {
                    bricks[r][c] = {
                        x: c * (brickParam.offSetLeft + brickParam.width) + brickParam.offSetLeft,
                        y: r * (brickParam.offSetTop + brickParam.height) + brickParam.offSetTop + brickParam.marginTop,
                        status: true
                    }
                }
            }
        }

        createBricks();



        function render() {


            const gameOverSoundPlay = () => {
                gameOverSound.play();
            };
            const winGameSoundPlay = () => {
                winGameSound.play();
            };



            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Drawing
            Draw(ctx, ballParam, platformParam, brickParam, playerParam, bricks);

            // Collisions
            Collision(
                canvas, ballParam, platformParam,
                brickParam, playerParam, bricks,
                objectHit, platformHit, lifeDecreasing);




            //Level Up
            let isLevelDone = true;

            // check if all the bricks are broken
            for (let r = 0; r < brickParam.row; r++) {
                for (let c = 0; c < brickParam.col; c++) {
                    isLevelDone = isLevelDone && !bricks[r][c].status;
                }
            }

            if (isLevelDone) {
                if (playerParam.level >= playerParam.maxLevel) {
                    winGameSoundPlay();
                    ctx.font = "50px serif";
                    ctx.fillStyle = playerParam.color;
                    ctx.fillText(`You Win`, canvas.width / 2 - 100, canvas.height / 2 - 100);
                    ctx.fillText(`Press F5 to play again`, canvas.width / 2 - 200, canvas.height / 2 - 250);
                    gameOver = true;

                }
                brickParam.row++;
                createBricks();
                ballParam.speed += 0.5;
                //reset Ball
                ballParam.x = canvas.width / 2;
                ballParam.y = platformParam.y - ballParam.radius;
                ballParam.dx = ballParam.speed;
                ballParam.dy = -ballParam.speed;

                playerParam.level++;
            }


            //Ball movement
            if (game) {
                ballParam.x += ballParam.dx;
                ballParam.y += ballParam.dy;
            } else if (!game) {
                ctx.font = "50px serif";
                ctx.fillStyle = playerParam.color;
                ctx.fillText(`Press Enter to start`, canvas.width / 2 - 200, canvas.height / 2 - 100);
            }




            //Platform movement

            if (rightPressed) {
                platformParam.x += platformParam.speed;
            }
            if (leftPressed) {
                platformParam.x -= platformParam.speed;
            }




            // Game Over
            if (playerParam.lives <= 0) {
                gameOverSoundPlay();
                ctx.font = "50px serif";
                ctx.fillStyle = playerParam.color;

                ctx.fillText(`Game Over`, canvas.width / 2 - 100, canvas.height / 2 - 100);
                ctx.fillText(`Press F5 to play again`, canvas.width / 2 - 200, canvas.height / 2 - 250);

                gameOver = true;

            }


            if (!gameOver) {
                if (game) {
                    bg_music.play();
                }
                requestAnimationFrame(render);
            }

            if (gameOver) {
                bg_music.pause();
            }

        }
        render();

    }, []);


    return (
        <div>
            <canvas id='canvas' ref={canvasRef} width='750' height='800'></canvas>
            <audio id='gameOverSound' src={gameOverSound}></audio>
            <audio id='winGameSound' src={winGameSound}></audio>
            <audio id='objectHit' src={objectHit}></audio>
            <audio id='bg_music' src={bg_music}></audio>
            <audio id='platformHit' src={platformHit}></audio>
            <audio id='lifeDecreasing' src={lifeDecreasing}></audio>
        </div>
    );
};

export default BrakeOut;