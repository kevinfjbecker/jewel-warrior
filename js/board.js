jewel.board = (function () {

    let
        settings,
        jewels,
        cols,
        rows,
        baseScore,
        numJewelTypes;

    ///////////////////////////////////////////////////////////////////////////

    function canJewelMove(x, y) {
        return (
            (x > 0 && canSwap(x, y, x - 1, y)) ||
            (x < cols - 1 && canSwap(x, y, x + 1, y)) ||
            (y > 0 && canSwap(x, y, x, y - 1)) ||
            (y < rows - 1 && canSwap(x, y, x, y + 1))
        )
    }

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

        jewels[y1][x1] = type1;
        jewels[y2][x2] = type2;

        return hasChain;
    }

    ///////////////////////////////////////////////////////////////////////////

    function check(events) {

        const
            chains = getChains(),
            removed = [],
            moved = [],
            gaps = [];
        let
            hadChains = false,
            score = 0;
        for (let x = 0; x < cols; x++) {
            gaps[x] = 0;
            // remove and slide down
            for (let y = rows - 1; y >= 0; y--) {
                if (chains[y][x] > 2) {
                    hadChains = true;
                    gaps[x]++;
                    removed.push({
                        x,
                        y,
                        type: getJewel(x, y)
                    });
                    // add points to score
                    score += baseScore * Math.pow(2, (chains[y][x] - 3))
                } else if (gaps[x] > 0) {
                    moved.push({
                        fromX: x,
                        fromY: y,
                        toX: x,
                        toY: y + gaps[x],
                        type: getJewel(x, y)
                    });
                    jewels[y + gaps[x]][x] = getJewel(x, y);
                }
            }
            // fill from top
            for (let y = 0; y < gaps[x]; y++) {
                jewels[y][x] = randomJewel();
                moved.push({
                    fromX: x,
                    fromY: y - gaps[x],
                    toX: x,
                    toY: y,
                    type: getJewel(x, y)
                });
            }
        }
        // recurse or return events
        events = events || [];
        if (hadChains) {
            events.push({
                type: "remove",
                data: removed
            }, {
                type: "score",
                data: score
            }, {
                type: "move",
                data: moved
            });
            return check(events); // check newly created chains
        } else {
            return events;
        }
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
        // recursive fill if the board has no moves
        if (!hasMoves()) {
            fillBoard();
        }
    }

    ///////////////////////////////////////////////////////////////////////////

    function getBoard() {
        return structuredClone(jewels);
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

    function hasMoves() {
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (canJewelMove(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
    ///////////////////////////////////////////////////////////////////////////

    function initialize(callback) {
        settings = jewel.settings;
        cols = settings.cols;
        rows = settings.rows;
        baseScore = settings.baseScore;
        numJewelTypes = settings.numJewelTypes;

        fillBoard();
        callback();
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

    function swap(x1, y1, x2, y2, callback) {

        let events = [],
            tmp,
            swap1,
            swap2;

        swap1 = {
            type: 'move',
            data: [
                {
                    type: getJewel(x1, y1),
                    fromX: x1,
                    fromY: y1,
                    toX: x2,
                    toY: y2
                },
                {
                    type: getJewel(x2, y2),
                    fromX: x2,
                    fromY: y2,
                    toX: x1,
                    toY: y1
                }
            ]
        };

        swap2 = {
            type: 'move',
            data: [
                {
                    type: getJewel(x2, y2),
                    fromX: x1,
                    fromY: y1,
                    toX: x2,
                    toY: y2
                },
                {
                    type: getJewel(x1, y1),
                    fromX: x2,
                    fromY: y2,
                    toX: x1,
                    toY: y1
                }
            ]
        };

        if (isAdjacent(x1, y1, x2, y2)) {

            events.push(swap1);

            if (canSwap(x1, y1, x2, y2)) {

                tmp = getJewel(x1, y1);
                jewels[y1][x1] = getJewel(x2, y2);
                jewels[y2][x2] = tmp;

                const reactionEvents = check();

                events = events.concat(reactionEvents);

            } else {

                events.push(swap2, { type: 'badswap' });

            }

            callback(events);
        }

    }

    ///////////////////////////////////////////////////////////////////////////

    return {
        canSwap,
        getBoard,
        initialize,
        print,
        swap,
    };

})();