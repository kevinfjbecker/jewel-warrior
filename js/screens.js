
jewel.screens['game-screen'] = (function () {
    const board = jewel.board;
    const display = jewel.display;
    function run() {
        board.initialize(function () {
            display.initialize(function () {
                board.print(); // todo: start the game
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
    function run() { };
    return {
        run
    };
})();

jewel.screens['splash-screen'] = (function () {
    const game = jewel.game;
    const dom = jewel.dom;
    let firstRun = true;
    function setup() {
        dom.bind('#splash-screen', 'click', function () {
            game.showScreen('main-menu');
        });
    }
    function run() {
        if (firstRun) {
            setup();
            firstRun = false;
        }
    }
    return {
        run
    };
})();
