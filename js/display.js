jewel.display = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    let animations = [],
        canvas,
        cols,
        ctx,
        cursor,
        firstRun = true,
        jewels = [],
        jewelSize,
        previousCycle,
        rows;

    function addAnimation(runTime, fncs) {
        animations.push({
            runTime,
            startTime: performance.now(),
            pos: 0,
            fncs
        });
    }

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

        renderCursor(time);
        renderAnimations(time, previousCycle)

        previousCycle = time;

        requestAnimationFrame(cycle);
    }

    function drawJewel(type, x, y, scale, rot) {
        const image = jewel.images[`images/jewels${jewelSize}.png`];
        ctx.save();
        if (typeof scale !== 'undefined' && scale > 0) {
            ctx.beginPath();
            ctx.rect(x, y, 1, 1);
            ctx.clip();
            ctx.translate(x + 0.5, y + 0.5);
            ctx.scale(scale, scale);
            if (rot) {
                ctx.rotate(rot);
            }
            ctx.translate(-x - 0.5, -y - 0.5);

        }
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
        ctx.restore();
    }

    function initialize(callback) {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        callback();
    }

    function moveJewels(movedJewels, callback) {

        const oldCursor = cursor;

        let n = movedJewels.length;

        cursor = null;

        movedJewels.forEach(function (e) {
            const x = e.fromX;
            const y = e.fromY;
            const dx = e.toX - x;
            const dy = e.toY - y;
            const dist = Math.abs(dx) + Math.abs(dy);

            addAnimation(200 * dist, {
                before: function (pos) {
                    pos = Math.sin(pos * Math.PI / 2);
                    clearJewel(x + dx * pos, y + dy * pos);
                },
                render: function (pos) {
                    pos = Math.sin(pos * Math.PI / 2);
                    drawJewel(e.type, x + dx * pos, y + dy * pos);
                },
                done: function (pos) {
                    if (--n == 0) {
                        cursor = oldCursor;
                        callback();
                    }
                }
            });
        });
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

    function refill(newJewels, callback) {
        let lastJewel = 0;
        addAnimation(1000, {
            render: function (pos) {
                const thisJewel = Math.floor(pos * cols * rows);
                let i,
                    x,
                    y;
                for (i = lastJewel; i < thisJewel; i++) {
                    x = i % cols;
                    y = Math.floor(i / cols);
                    clearJewel(x, y);
                    drawJewel(newJewels[y][x], x, y);
                }
                lastJewel = thisJewel;
                canvas.style.transform = `rotateX(${360 * pos}deg)`;
            },
            done: function(){
                canvas.style.transform = '';
                callback();
            }
        })
    }

    function removeJewels(removedJewels, callback) {
        let n = removedJewels.length;
        removedJewels.forEach(function (e) {
            addAnimation(400, {
                before: function () {
                    clearJewel(e.x, e.y);
                },
                render: function (pos) {
                    ctx.save();
                    ctx.globalAlpha = 1 - pos;
                    drawJewel(e.type, e.x, e.y, 1 - pos, pos * Math.PI * 2);
                    ctx.restore();
                },
                done: function () {
                    if (--n == 0) {
                        callback();
                    }
                }
            })
        });
    }

    function renderAnimations(time, lastTime) {

        const anims = animations.slice(0);
        const n = anims.length;

        let animTime,
            anim,
            i;

        // call before() function
        for (i = 0; i < n; i++) {
            anim = anims[i];
            if (anim.fncs.before) {
                anim.fncs.before(anim.pos);
            }
            anim.lastPos = anim.pos;
            animTime = (lastTime - anim.startTime);
            anim.pos = animTime / anim.runTime;
            anim.pos = Math.max(0, Math.min(1, anim.pos));
        }
        animations = [];
        for (i = 0; i < n; i++) {
            anim = anims[i];
            anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
            if (anim.pos == 1) {
                if (anim.fncs.done) {
                    anim.fncs.done();
                }
            } else {
                animations.push(anim);
            }
        }
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

        previousCycle = performance.now();
        requestAnimationFrame(cycle);
    }

    return {
        initialize,
        moveJewels,
        redraw,
        refill,
        removeJewels,
        setCursor
    };

})();