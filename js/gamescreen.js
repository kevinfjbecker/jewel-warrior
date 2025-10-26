
jewel.screens['game-screen'] = (function () {

    const board = jewel.board;
    const display = jewel.display;
    const input = jewel.input;
    const settings = jewel.settings;

    let cursor;
    let firstRun = true;

    function moveCursor(x, y) {
        if (cursor.selected) {
            x += cursor.x;
            y += cursor.y;
            if (
                x >= 0 && x < settings.cols &&
                y >= 0 && y < settings.rows
            ) {
                selectJewel(x, y);
            }
        } else {
            x = (cursor.x + x + settings.cols) % settings.cols;
            y = (cursor.y + y + settings.rows) % settings.rows;
            setCursor(x, y, false);
        }
    }

    function moveDown() {
        moveCursor(0, 1);
    }
    function moveLeft() {
        moveCursor(-1, 0);
    }
    function moveRight() {
        moveCursor(1, 0);
    }
    function moveUp() {
        moveCursor(0, -1);
    }

    function playBoardEvents(events) {
        if (events.length > 0) {
            const boardEvent = events.shift();
            const next = function () {
                playBoardEvents(events);
            }

            switch (boardEvent.type) {
                case 'move':
                    display.moveJewels(boardEvent.data, next);
                    break;
                case 'remove':
                    display.removeJewels(boardEvent.data, next);
                    break;
                case 'refill':
                    display.refill(boardEvent.data, next);
                    break;
                default:
                    next();
                    break;
            }
        } else {
            display.redraw(board.getBoard(), function () {
                // go to go again
            });
        }
    }

    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
        board.initialize(function () {
            display.initialize(function () {
                cursor = {
                    x: 0,
                    y: 0,
                    selected: false
                };
                display.redraw(jewel.board.getBoard(), function () {
                    // board.print(); // todo: start the game
                });
            });
        });
    }

    function selectJewel(x, y) {
        if (arguments.length === 0) {
            selectJewel(cursor.x, cursor.y);
            return;
        }
        if (cursor.selected) {
            const dx = Math.abs(x - cursor.x);
            const dy = Math.abs(y - cursor.y);
            dist = dx + dy;
            if (dist === 0) {
                // todo: debug me!
                // deselected the selected jewel
                setCursor(x, y, false);
            } else if (dist === 1) {
                // selected an adjacent jewel
                board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
                setCursor(x, y, false);
            } else {
                // selected a different jewel
                setCursor(x, y, true);
            }
        } else {
            setCursor(x, y, true);
        }
    }

    function setCursor(x, y, select) {
        cursor.x = x;
        cursor.y = y;
        cursor.selected = select;
        display.setCursor(x, y, select);
    }

    function setup() {
        input.initialize();
        input.bind('selectJewel', selectJewel)
        input.bind('moveUp', moveUp);
        input.bind('moveDown', moveDown);
        input.bind('moveLeft', moveLeft);
        input.bind('moveRight', moveRight);
    }

    return {
        run
    };
})();
