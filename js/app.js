const jewel = {
    screens: {},
    settings: {
        baseScore: 100,
        cols: 8,
        jewelSize: null,
        numJewelTypes: 7,
        rows: 8,
    }
};

window.addEventListener('load', function () {
    const jewelProto = this.document.getElementById('jewel-proto');
    const rect = jewelProto.getBoundingClientRect();
    jewel.settings.jewelSize = rect.width;
});