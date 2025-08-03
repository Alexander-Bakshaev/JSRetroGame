export default class Character {
    /**
     * Creates a new Character.
     * @param {number} level - Level of a character.
     * @param {number} attack - Attack power of a character.
     * @param {number} defence - Defence power of a character.
     * @param {string} [type='generic'] - Type of the chosen character.
     */
    constructor(level, attack, defence, type = 'generic') {
        if (new.target.name === 'Character') {
            throw Error(
                'Персонаж должен быть экземпляром Character',
            );
        } else if (level < 1) {
            throw new Error(
                'Уровень персонажа не может быть меньше 1',
            );
        }
        this.level = level;
        this.attack = attack;
        this.defence = defence;
        this.health = 50;
        this.type = type;
        this.setLevelStats(level);
    }

    /**
     * Raises the character's level up by one and
     * increases attack and health by an amount of health.
     */
    levelUp() {
        if (this.health > 0) {
            this.level += 1;
            this.attack = Math.floor(
                Math.max(this.attack, this.attack * ((80 + this.health) / 100)),
            );
            this.health = (this.health + 30 < 100) ? this.health + 30 : 100;
        } else {
            throw new Error(
                'Нельзя повысить уровень умершего',
            );
        }
    }

    /**
     * Sets the attack and defence of the
     * character depending on the level.
     * @param {number} level - level of a character.
     */
    setLevelStats(level) {
        this.attack = Math.floor(
            this.attack * (1 + (level - 1) / 10),
        );
        this.defence = Math.floor(
            this.defence * (1 + (level - 1) / 10),
        );
    }
}
