jewel.board = (function () {

    let
        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes;

    ///////////////////////////////////////////////////////////////////////////

    function canSwap(x1, y1, x2, y2) {
        const type1 = getJewel(x1, y1);
        const type2 = getJewel(x2, y2);
        let hasChain;

        if (!isAdjacent(x1, y1, x2, y2)) {
            return false;
        }

        jewels[y1][x1] = type2; // swap temporarily
        jewels[y2][x2] = type1;

        hasChain = checkChain(x1, y1) > 2 || checkChain(x2, y2) > 2;

        jewels[y1][x1] = type2;
        jewels[y2][x2] = type1;

        return hasChain;
    }

    ///////////////////////////////////////////////////////////////////////////

    function checkChain(x, y) {
        const type = getJewel(x, y);
        let left = 0,
            right = 0,
            up = 0,
            down = 0,
            nextType;

        // right
        nextType = getJewel(x + right + 1, y);
        while (type === nextType) {
            right++;
            nextType = getJewel(x + right + 1, y);
        }

        // left
        nextType = getJewel(x - left - 1, y);
        while (type === nextType) {
            left++;
            nextType = getJewel(x - left - 1, y);
        }

        // up (yes, up is negative)
        nextType = getJewel(x, y - up - 1);
        while (type === nextType) {
            up++;
            nextType = getJewel(x, y - up - 1);
        }

        // down
        nextType = getJewel(x, y + down + 1);
        while (type === nextType) {
            down++;
            nextType = getJewel(x, y + down + 1);
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

    function getChains() {
        let x,
            y;
        const chains = [];

        for (y = 0; y < rows; y++) {
            chains[y] = [];
            for (x = 0; x < cols; x++) {
                chains[y][x] = checkChain(x, y);
            }
        }

        return chains;
    }

    ///////////////////////////////////////////////////////////////////////////

    function getJewel(x, y) {
        return (jewels[y] && jewels[y][x]) ?? -1;
    }

    ///////////////////////////////////////////////////////////////////////////

    function initialize(/*callback*/) {
        settings = jewel.settings;
        cols = settings.cols;
        rows = settings.rows;
        baseScore = settings.baseScore;
        numJewelTypes = settings.numJewelTypes;

        fillBoard();
        // callback();
    }

    ///////////////////////////////////////////////////////////////////////////

    function isAdjacent(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2) === 1
    }

    ///////////////////////////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////////////////////////////////

    function randomJewel() {
        return Math.floor(Math.random() * numJewelTypes);
    }

    ///////////////////////////////////////////////////////////////////////////

    return {

        mapBoardToChains,

        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes,

        canSwap,
        checkChain,
        fillBoard,
        getChains,
        getJewel,
        initialize,
        isAdjacent,
        print,
        randomJewel

    };

})();