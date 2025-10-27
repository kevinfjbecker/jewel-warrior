jewel.display = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    let canvas,
        cols,
        ctx,
        cursor,
        firstRun = true,
        jewels = [],
        jewelSize,
        previousCycle,
        rows;

    function clearCursor() {
        if (cursor) {
            const x = cursor.x;
            const y = cursor.y;
            clearJewel(x, y);
            drawJewel(jewels[y][x], x, y);
        }
    }

    function clearJewel(x, y) {
        ctx.clearRect(x, y, 1, 1);
    }

    function createBackground() {
        const background = document.createElement('canvas');
        background.width = cols * jewelSize;
        background.height = rows * jewelSize;
        dom.addClass(background, 'board-bg');

        const bgctx = background.getContext('2d');
        bgctx.fillStyle = 'rgba(225, 235, 255, 0.15)';
        bgctx.scale(jewelSize, jewelSize);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if ((x + y) % 2) {
                    bgctx.fillRect(x, y, 1, 1);
                }
            }
        }

        return background;
    }

    function cycle(time) {
        previousCycle = time;

        renderCursor(time);

        requestAnimationFrame(cycle);
    }

    function drawJewel(type, x, y) {
        const image = jewel.images[`images/jewels${jewelSize}.png`];
        ctx.drawImage(
            image,
            type * jewelSize,
            0,
            jewelSize,
            jewelSize,
            x,
            y,
            1,
            1
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
        // renderCursor();
        callback();
    }

    function removeJewels(removedJewels, callback) {
        const n = removedJewels.length;
        for (let i = 0; i < n; i++) {
            clearJewel(removedJewels[i].x, removedJewels[i].y);
        }
        callback();
    }

    function renderCursor(time) {
        if (!cursor) {
            return;
        }

        const x = cursor.x;
        const y = cursor.y;
        const t1 = (Math.sin(time / 200) + 1) / 2;
        const t2 = (Math.sin(time / 400) + 1) / 2;

        clearCursor();

        if (cursor.selected) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.8 * t1;
            drawJewel(jewels[y][x], x, y);
            ctx.restore();
        }

        ctx.save();
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = `rgba(250, 250, 150, ${0.5 + 0.5 * t2}`;
        ctx.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9);
        ctx.restore();
    }

    function setCursor(x, y, selected) {
        clearCursor();
        if (arguments.length > 0) {
            cursor = { x, y, selected };
        } else {
            cursor = null;
        }
    }

    function setup() {
        const boardElement = $('#game-screen .game-board')[0];

        cols = jewel.settings.cols;
        rows = jewel.settings.rows;
        jewelSize = jewel.settings.jewelSize;

        canvas = document.createElement('canvas');
        canvas.width = cols * jewelSize;
        canvas.height = rows * jewelSize;
        dom.addClass(canvas, 'board');

        ctx = canvas.getContext('2d');
        ctx.scale(jewelSize, jewelSize);

        boardElement.appendChild(createBackground());
        boardElement.appendChild(canvas);

        previousCycle = Date.now();
        requestAnimationFrame(cycle);
    }

    return {
        initialize,
        moveJewels,
        redraw,
        removeJewels,
        setCursor
    };

})();