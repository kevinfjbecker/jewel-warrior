jewel.input = (function () {
    const dom = jewel.dom;
    const $ = dom.$;
    const settings = jewel.settings;
    let inputHandlers;

    function bind(action, handler) {

    }

    function initialize() {
        inputHandlers = {};
        const board = $('#game-screen .game-board')[0];
        dom.bind(board, 'mousedown', function(event){
            handleClick(event, 'CLICK', event);
        });
    }

    function trigger(action) {

    }

    return {
        initialize
    };

})();