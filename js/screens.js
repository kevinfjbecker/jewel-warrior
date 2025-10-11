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