import Character from '../Character';

export default class Swordsman extends Character {
    /**
     * Create a new Swordsman of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 40, 10, 'Swordsman');
        this.moveDistance = 4;
        this.attackDistance = 1;
    }
}
