
jewel.screens['game-screen'] = (function () {
    const board = jewel.board;
    const display = jewel.display;
    function run() {
        board.initialize(function () {
            display.initialize(function () {
                display.redraw(jewel.board.getBoard(), function () {
                    // board.print(); // todo: start the game
                });
            });
        });
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
