import Character from './Character';

export default class PositionedCharacter {
    /**
     * Represents a character positioned on the game board.
     * @param {Character} character - The character instance that is positioned.
     * @param {number} position - The position of the character
     * on the board (should be a number).
     */
    constructor(character, position) {
        if (!(character instanceof Character)) {
            throw new Error(
                'Персонаж должен быть экземпляром Character',
            );
        }

        if (typeof position !== 'number') {
            throw new Error(
                'Позиция может быть только числом',
            );
        }

        this.character = character;
        this.position = position;
    }
}
