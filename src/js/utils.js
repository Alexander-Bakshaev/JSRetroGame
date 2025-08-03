/**
 * Calculates the type of tile on a square board based on its index.
 * @param {number} index - The index of the tile on the board.
 * @param {number} boardSize - The size of the square board (length or width).
 * @returns {string} - The type of the tile: top-left, top-right, top,
 * bottom-left, bottom-right, bottom, right, left, or center.
 */
export function calcTileType(index, boardSize) {
    if (index < boardSize - 1
      && index > 0) {
        return 'top';
    }

    if (index < boardSize ** 2 - 1
      && index > boardSize ** 2 - boardSize) {
        return 'bottom';
    }

    for (let i = 1; i < boardSize - 1; i += 1) {
        if (index === boardSize * i) {
            return 'left';
        }
        if (index === boardSize * i + (boardSize - 1)) {
            return 'right';
        }
    }

    switch (index) {
        case 0:
            return 'top-left';
        case boardSize - 1:
            return 'top-right';
        case boardSize * (boardSize - 1):
            return 'bottom-left';
        case boardSize ** 2 - 1:
            return 'bottom-right';
        default:
            return 'center';
    }
}

/**
 * Determines the health status of a character based on their health value.
 * @param {number} health - The current health value of the character.
 * @returns {string} - The health level: critical, normal, or high.
 */
export function calcHealthLevel(health) {
    if (health < 15) {
        return 'critical';
    }
    if (health < 50) {
        return 'normal';
    }
    return 'high';
}
