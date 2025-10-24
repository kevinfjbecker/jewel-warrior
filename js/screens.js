
jewel.screens['game-screen'] = (function () {

    const board = jewel.board;
    const display = jewel.display;
    let cursor;

    function run() {
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
        cursor.select = select;
    }

    return {
        run
    };
})();

jewel.screens['install-screen'] = (function () {
    function run() { };
    return {
        run
    };
})();

jewel.screens['main-menu'] = (function () {
    const game = jewel.game;
    const dom = jewel.dom;
    let firstRun = true;
    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    };
    function setup() {
        dom.bind('#main-menu', 'click', function (e) {
            // console.log(e.target.name) // debug
            switch (e.target.name) {
                case 'game-screen':
                    game.showScreen('game-screen');
                    break;
            }
        });
    }
    return {
        run
    };
})();

jewel.screens['splash-screen'] = (function () {
    const game = jewel.game;
    const dom = jewel.dom;
    let firstRun = true;
    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }
    function setup() {
        dom.bind('#splash-screen', 'click', function () {
            game.showScreen('main-menu');
        });
    }
    return {
        run
    };
})();
