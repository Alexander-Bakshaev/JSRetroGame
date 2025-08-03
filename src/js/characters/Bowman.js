import Character from '../Character';

export default class Bowman extends Character {
    /**
     * Create a new Bowman of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 25, 25, 'Bowman');
        this.moveDistance = 2;
        this.attackDistance = 2;
    }
}
