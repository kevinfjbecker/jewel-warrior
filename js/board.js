jewel.board = (function () {
    let
        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes;

    function fillBoard() {
        jewels = [];
        for (let y = 0; y < rows; y++) {
            jewels[y] = [];
            for (let x = 0; x < cols; x++) {
                jewels[y][x] = randomJewel();
            }
        }
    }

    function getJewel(x, y) {
        return jewels[y][x];
    }

    function initialize(callback) {
        settings = jewel.settings;
        cols = settings.cols;
        rows = settings.rows;
        baseScore = settings.baseScore;
        numJewelTypes = settings.numJewelTypes;
        fillBoard();
        console.log(jewels)
        callback();
    }

    function print() {
        let str = '';
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                str += getJewel(x, y) + ' ';
            }
            str += '\r\n';
        }
        console.log(str);
    }

    function randomJewel() {
        return Math.floor(Math.random() * numJewelTypes);
    }

    return {

        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes,

        initialize,
        print
    };

})();