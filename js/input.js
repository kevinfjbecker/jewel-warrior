jewel.input = (function () {
    const dom = jewel.dom;
    const $ = dom.$;
    const settings = jewel.settings;
    const keys = {
        37: 'KEY_LEFT',
        38: 'KEY_UP',
        39: 'KEY_RIGHT',
        40: 'KEY_DOWN',
        13: 'KEY_ENTER',
        32: 'KEY_SPACE',
    };
    let inputHandlers;

    function bind(action, handler) {
        if (!inputHandlers[action]) {
            inputHandlers[action] = [];
        }
        inputHandlers[action].push(handler);
    }

    function handleClick(event, control, click) {
        const action = settings.controls[control];
        if (!action) {
            return;
        }
        const board = $('#game-screen .board')[0];
        const rect = board.getBoundingClientRect();
        const relX = click.clientX - rect.left;
        const relY = click.clientY - rect.top;
        const jewelX = Math.floor(relX / rect.width * settings.cols);
        const jewelY = Math.floor(relY / rect.height * settings.rows);
        trigger(action, jewelX, jewelY);
        event.preventDefault();
    }

    function initialize() {

        inputHandlers = {};
        const board = $('#game-screen .game-board')[0];
        
        dom.bind(board, 'mousedown', function (event) {
            handleClick(event, 'CLICK', event);
        });
        
        dom.bind(board, 'touchstart', function (event) {
            handleClick(event, 'TOUCH', event.targetTouches[0]);
        });

        dom.bind(document, 'keydown', function (event) {
            var keyName = keys[event.keyCode]
            if (keyName && settings.controls[keyName]) {
                event.preventDefault();
                trigger(settings.controls[keyName]);
            }
        });
    }

    function trigger(action) {
        const handlers = inputHandlers[action];
        const args = Array.prototype.slice.call(arguments, 1);
        if (handlers) {
            for (let i = 0; i < handlers.length; i++) {
                handlers[i].apply(null, args);
            }
        }
    }

    return {
        bind,
        initialize
    };

})();