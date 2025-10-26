jewel.display = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    let canvas,
        ctx,
        cursor,
        cols,
        rows,
        jewels = [],
        jewelSize,
        firstRun = true;

    function clearCursor() {
        if (cursor) {
            const x = cursor.x;
            const y = cursor.y;
            clearJewel(x, y);
            drawJewel(jewels[y][x], x, y);
        }
    }

    function clearJewel(x, y) {
        ctx.clearRect(x * jewelSize, y * jewelSize, jewelSize, jewelSize);
    }

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

    function moveJewels(movedJewels, callback) {
        const n = movedJewels.length;
        let mover;
        let i;
        for (i = 0; i < n; i++) {
            mover = movedJewels[i];
            clearJewel(mover.fromX, mover.fromY);
        }
        for (i = 0; i < n; i++) {
            mover = movedJewels[i];
            drawJewel(mover.type, mover.toX, mover.toY);
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
        renderCursor();
        callback();
    }

    function removeJewels(removedJewels, callback) {
        const n = removedJewels.length;
        for (let i = 0; i < n; i++) {
            clearJewel(removedJewels[i].x, removedJewels[i].y);
        }
        callback();
    }

    function renderCursor() {
        if (!cursor) {
            return;
        }
        const x = cursor.x;
        const y = cursor.y;
        clearCursor();
        if (cursor.selected) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.5; // 0.8 in book
            drawJewel(jewels[y][x], x, y);
            ctx.restore();
        }
        ctx.save();
        ctx.lineWidth = 0.05 * jewelSize;
        ctx.strokeStyle = 'rgba(250, 250, 150, 0.8)';
        ctx.strokeRect(
            (x + 0.05) * jewelSize,
            (y + 0.05) * jewelSize,
            0.9 * jewelSize,
            0.9 * jewelSize
        );
        ctx.restore();
    }

    function setCursor(x, y, selected) {
        clearCursor();
        if (arguments.length > 0) {
            cursor = { x, y, selected };
        } else {
            cursor = null;
        }
        renderCursor();
        ctx.restore();
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
        moveJewels,
        redraw,
        removeJewels,
        setCursor
    };

})();