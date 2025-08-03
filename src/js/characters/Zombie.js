import Character from '../Character';

export default class Zombie extends Character {
    /**
     * Create a new Zombie of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 10, 25, 'Zombie');
        this.moveDistance = 1;
        this.attackDistance = 1;
    }
}
