
const Draw = (ctx, ballParam, platformParam, brickParam, playerParam, bricks) => {

   // let brickss = bricks;

    // Drawing a ball
    ctx.beginPath();
    ctx.arc(ballParam.x, ballParam.y, ballParam.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white'
    ctx.fill();

    // Drawing a platform
    ctx.beginPath();
    ctx.rect(platformParam.x, platformParam.y, platformParam.width, platformParam.height);
    ctx.strokeRect(platformParam.x, platformParam.y, platformParam.width, platformParam.height);
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = platformParam.color;
    ctx.fill();


    //Drawing bricks
    for (let r = 0; r < brickParam.row; r++) {
        for (let c = 0; c < brickParam.col; c++) {
            let b = bricks[r][c];
            //if the brick isn't broken
            if (b.status) {
                ctx.fillStyle = '#251172';
                ctx.fillRect(b.x, b.y, brickParam.width, brickParam.height);

                ctx.strokeStyle = brickParam.strokeColor;
                ctx.strokeRect(b.x, b.y, brickParam.width, brickParam.height);
            }
        }
    }

    //Draw user interface
    ctx.font = "20px serif";
    ctx.fillStyle = playerParam.color;
    ctx.fillText(`Score: ${playerParam.score}`, 10, 50);

    ctx.font = "20px serif";
    ctx.fillStyle = playerParam.color;
    ctx.fillText(`Level: ${playerParam.level}`, 350, 50);


    ctx.font = "20px serif";
    ctx.fillStyle = playerParam.color;
    ctx.fillText(`Lives: ${playerParam.lives}`, 670, 50);
};

export default Draw;