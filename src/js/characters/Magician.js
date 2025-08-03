import Character from '../Character';

export default class Magician extends Character {
    /**
     * Create a new Magician of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 10, 40, 'Magician');
        this.moveDistance = 1;
        this.attackDistance = 4;
    }
}
