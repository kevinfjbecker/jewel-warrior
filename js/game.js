jewel.game = (function () {

    const dom = jewel.dom;
    const $ = dom.$;

    function createBackground() {
        const background = document.querySelector('#game .background');
        const rect = background.getBoundingClientRect();

        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        ctx.scale(rect.width, rect.height);

        const gradient = ctx.createRadialGradient(
            0.25, 0.15, 0.5,
            0.25, 0.15, 1
        )
        gradient.addColorStop(0, 'rgb(55, 65, 50)');
        gradient.addColorStop(1, 'rgb(0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 1);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        
        ctx.lineWidth = 0.008;

        ctx.beginPath();
        for (let i = 0; i < 2; i += 0.020) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i - 1, 1);
        }
        ctx.stroke();

        background.append(canvas);
    }

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
        createBackground();

        // disable native touchmove behavior
        // to prevent overscroll
        document.addEventListener(
            'touchmove',
            (e) => { e.preventDefault(); },
            { passive: false });
    }

    return {
        createBackground,
        setup,
        showScreen
    };

})();