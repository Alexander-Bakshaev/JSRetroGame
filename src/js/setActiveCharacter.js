import PositionedCharacter from './PositionedCharacter';

/**
 * Sets the active character's possible movement and attack positions on the board.
 * @param {PositionedCharacter} positionedCharacter - The character instance that is currently active.
 * @param {number} boardSize - The size of the game board (assumed to be a square grid).
 * @returns {Object} The updated positionedCharacter with move and attack positions.
 *   - move: An array of valid indexes where the character can move.
 *   - attack: An array of valid indexes where the character can attack.
 */
export default function setActiveCharacter(positionedCharacter, boardSize) {
    if (typeof boardSize !== 'number') {
        throw new Error(
            'There is wrong boardSize',
        );
    } else if (!(positionedCharacter instanceof PositionedCharacter)) {
        throw new Error(
            'There must be a class type PositionedCharacter',
        );
    }

    const index = positionedCharacter.position;
    const { moveDistance, attackDistance } = positionedCharacter.character;

    const moveIndexes = [];
    const attackIndexes = [];

    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (let i = -moveDistance; i <= moveDistance; i++) {
        for (let j = -moveDistance; j <= moveDistance; j++) {
            if (i === 0
              || j === 0
              || Math.abs(i) === Math.abs(j)) {
                const newRow = row + i;
                const newCol = col + j;

                if (newRow >= 0
                  && newRow < boardSize
                  && newCol >= 0
                  && newCol < boardSize) {
                    const newIndex = newRow * boardSize + newCol;
                    moveIndexes.push(newIndex);
                }
            }
        }
    }

    for (let i = -attackDistance; i <= attackDistance; i++) {
        for (let j = -attackDistance; j <= attackDistance; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (newRow >= 0
              && newRow < boardSize
              && newCol >= 0
              && newCol < boardSize) {
                const newIndex = newRow * boardSize + newCol;
                attackIndexes.push(newIndex);
            }
        }
    }

    return {
        ...positionedCharacter,
        move: moveIndexes,
        attack: attackIndexes,
    };
}
