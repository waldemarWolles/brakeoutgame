
const Collision = (canvas, ballParam, platformParam, brickParam, playerParam, bricks,
    objectHit, platformHit, lifeDecreasing) => {

    // Bricks Collision
    for (let r = 0; r < brickParam.row; r++) {
        for (let c = 0; c < brickParam.col; c++) {
            let b = bricks[r][c];
            //if the brick isn't broken
            if (b.status) {
                if (ballParam.x + ballParam.radius > b.x && ballParam.x - ballParam.radius < b.x + brickParam.width &&
                    ballParam.y + ballParam.radius > b.y && ballParam.y - ballParam.radius < b.y + brickParam.height) {
                    ballParam.dy = - ballParam.dy;
                    b.status = false; // brick is broken
                    playerParam.score += 10;
                    objectHit.play();
                }
            }
        }
    }


    // Bouncing ball from the left and right walls
    if (ballParam.x + ballParam.radius > canvas.width || ballParam.x - ballParam.radius < 0) {
        ballParam.dx *= -1;

    }
    // Bouncing ball from the top and bottom walls
    if (ballParam.y - ballParam.radius < 0) {
        ballParam.dy *= -1;


    } else if (ballParam.y + ballParam.radius > canvas.height) {
        playerParam.lives--;
        lifeDecreasing.play();

        //reset Ball
        ballParam.x = canvas.width / 2;
        ballParam.y = platformParam.y - ballParam.radius;
        ballParam.dx = ballParam.speed;
        ballParam.dy = -ballParam.speed;

    }


    //Platform walls collision
    if (platformParam.x < 10) {
        platformParam.x = 10;
    } else if (platformParam.x + platformParam.width > canvas.width - 10) {
        platformParam.x = (canvas.width - 10 - platformParam.width);
    }

    //Ball and platform collision
    if (ballParam.x > platformParam.x &&
        ballParam.x < platformParam.x + platformParam.width &&
        platformParam.y < platformParam.y + platformParam.height &&
        ballParam.y + ballParam.radius > platformParam.y - platformParam.height / 2
    ) {

        platformHit.play();
        //Cheking ball and platform hitting location
        let collisionPoint = ballParam.x - (platformParam.x + platformParam.width / 2);

        //Normalize value
        collisionPoint = collisionPoint / (platformParam.width / 2);

        //Calculate the angle of the ball
        let angle = collisionPoint * (Math.PI / 3); // Math.PI / 3 = 60 degrees

        ballParam.dx = ballParam.speed * Math.sin(angle);
        ballParam.dy = -ballParam.speed * Math.cos(angle);
    }
};

export default Collision;