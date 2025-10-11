function testStandAlone() {
    return window.navigator.standalone != false;
}

jewel.game.setup();

if (testStandAlone()) {
    jewel.game.showScreen('splash-screen');
} else {
    jewel.game.showScreen('install-screen');
}
