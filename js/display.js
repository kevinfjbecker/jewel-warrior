jewel.display = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    let canvas,
        ctx,
        cols,
        rows,
        jewels = [],
        jewelSize,
        firstRun = true;

    function createBackground() {
        const background = document.createElement('canvas');
        const bgctx = background.getContext('2d');
        dom.addClass(background, 'board-bg');
        background.width = cols * jewelSize;
        background.height = rows * jewelSize;
        bgctx.fillStyle = 'rgba(225, 235, 255, 0.15)';
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if ((x + y) % 2) {
                    bgctx.fillRect(
                        x * jewelSize,
                        y * jewelSize,
                        jewelSize,
                        jewelSize
                    );
                }
            }
        }
        return background;
    }

    function drawJewel(type, x, y) {
        const image = jewel.images['images/jewels' + jewelSize + '.png'];
        ctx.drawImage(
            image,
            type * jewelSize,
            0,
            jewelSize,
            jewelSize,
            x * jewelSize,
            y * jewelSize,
            jewelSize,
            jewelSize
        );
    }

    function initialize(callback) {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        callback();
    }

    function redraw(newJewels, callback) {
        jewels = newJewels;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                drawJewel(jewels[y][x], x, y);
            }
        }
        callback();
    }

    function setup() {
        const boardElement = $('#game-screen .game-board')[0];
        cols = jewel.settings.cols;
        rows = jewel.settings.rows;
        jewelSize = jewel.settings.jewelSize;
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        dom.addClass(canvas, 'board');
        canvas.width = cols * jewelSize;
        canvas.height = rows * jewelSize;
        boardElement.appendChild(createBackground());
        boardElement.appendChild(canvas);
    }

    return {
        initialize,
        redraw
    };

})();