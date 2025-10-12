jewel.board = (function () {
    let
        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes;

    ///////////////////////////////////////////////////////////////////////////

    function checkChain(x, y) {
        const type = getJewel(x, y);
        let left = 0,
            right = 0,
            up = 0,
            down = 0;
        
        // right
        while(type === getJewel(x + right + 1, y)) {
            right++;
        }
        
        // left
        while(type === getJewel(x - left - 1, y)) {
            left++;
        }
        
        // up (yes, up is negative)
        while(type === getJewel(x, y - up - 1)) {
            up++;
        }
        
        // down
        while(type === getJewel(x, y + down + 1)) {
            down++;
        }

        return Math.max(left + 1 + right, up + 1 + down);
    }

    ///////////////////////////////////////////////////////////////////////////

    function fillBoard() {
        let x,
            y,
            type;
        jewels = [];
        for (y = 0; y < rows; y++) {
            jewels[y] = [];
            for (x = 0; x < cols; x++) {
                type = randomJewel();
                while (
                    (
                        type === getJewel(x - 1, y) &&
                        type === getJewel(x - 2, y)
                    ) ||
                    (
                        type === getJewel(x, y - 1) &&
                        type === getJewel(x, y - 2)
                    )
                ) {
                    type = randomJewel();
                }
                jewels[y][x] = type;
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    function getJewel(x, y) {
        return (jewels[y] && jewels[y][x]) ?? -1;
    }

    function initialize(/*callback*/) {
        settings = jewel.settings;
        cols = settings.cols;
        rows = settings.rows;
        baseScore = settings.baseScore;
        numJewelTypes = settings.numJewelTypes;
        fillBoard();
        // callback();
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

        checkChain,
        fillBoard,
        getJewel,
        initialize,
        print,
        randomJewel

    };

})();