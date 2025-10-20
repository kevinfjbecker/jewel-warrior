jewel.display = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    let canvas,
        ctx,
        cols,
        rows,
        jewelSize,
        firstRun = true;

    function initialize(callback) {
        if(firstRun) {
            setup();
            firstRun = false;
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
        boardElement.appendChild(canvas);
    }

    return {
        initialize
    };

})();