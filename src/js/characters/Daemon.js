import Character from '../Character';

export default class Daemon extends Character {
    /**
     * Create a new Daemon of the given level.
     * @param {number} level - level of the character
     */
    constructor(level) {
        super(level, 10, 10, 'Daemon');
        this.moveDistance = 1;
        this.attackDistance = 4;
    }
}
