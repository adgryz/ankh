export const paintHex = (canvas, x, y, size, color) => {
    canvas.beginPath();
    canvas.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    for (let side = 0; side < 7; side++) {
        canvas.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    }

    canvas.fillStyle = color;
    canvas.fill();
}

export const paintBoard = (canvas) => {
    const size = 50;
    const yOffset = size * Math.sqrt(size);
    const xOffset = size * 2;

    const paintBoardHex = (x, y, color) => paintHex(canvas, x, y, size, color);

    paintBoardHex(50, 50, 'red');
    paintBoardHex(150, 50, 'blue');
}