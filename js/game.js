jewel.game = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    const showScreen = (screenId) => {
        const activeScreen = $('#game .screen.active')[0];
        const screen = $('#' + screenId)[0];
        if (activeScreen) {
            dom.removeClass(activeScreen, 'active');
        }
        dom.addClass(screen, 'active');
        jewel.screens[screenId].run();
    };

    function setup() {
        // disable native touchmove behavior
        // to prevent overscroll
        document.addEventListener(
            'touchmove',
            (e) => { e.preventDefault(); },
            { passive: false });
    }

    return {
        setup,
        showScreen
    };

})();