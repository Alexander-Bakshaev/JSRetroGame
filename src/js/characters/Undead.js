import Character from '../Character';

export default class Undead extends Character {
    /**
     * Create a new Undead of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 40, 10, 'Undead');
        this.moveDistance = 4;
        this.attackDistance = 1;
    }
}
