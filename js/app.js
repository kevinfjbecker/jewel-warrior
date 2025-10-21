const jewel = {
    screens: {},
    settings: {
        baseScore: 100,
        cols: 8,
        jewelSize: null,
        numJewelTypes: 6,
        rows: 7,
        controls: {
            KEY_UP: "moveUp",
            KEY_LEFT: "moveLeft",
            KEY_DOWN: "moveDown",
            KEY_RIGHT: "moveRight",
            KEY_ENTER: "selectJewel",
            KEY_SPACE: "selectJewel",
            CLICK: "selectJewel",
            TOUCH: "selectJewel",
        }
    },
    images: {}
};

function loadImages(jewelSize) {
    const path = 'images/jewels' + jewelSize + '.png';
    const img = new Image();
    img.src = path
    jewel.images[path] = img;
}

window.addEventListener('load', function () {

    const jewelProto = this.document.getElementById('jewel-proto');
    const rect = jewelProto.getBoundingClientRect();
    jewel.settings.jewelSize = rect.width;

    loadImages(jewel.settings.jewelSize); // todo: load more images

});