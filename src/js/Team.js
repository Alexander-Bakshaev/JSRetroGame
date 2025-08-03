export default class Team {
    /**
     * Creates an instance of the Team class.
     * Initializes the team with an empty set of members.
     */
    constructor() {
        this.members = new Set();
    }

    /**
     * Adds a character to the team.
     * @param {Object} character - The character to be added to the team.
     */
    add(character) {
        if (this.members.has(character)) {
            throw new Error(
                'Этот персонаж уже присутствует в команде',
            );
        }
        this.members.add(character);
    }

    /**
     * Adds multiple characters to the team.
     * @param {...Object} characters - The characters to be added to the team.
     */
    addAll(...characters) {
        characters.forEach((character) => {
            if (!this.members.has(character)) {
                this.members.add(character);
            }
        });
    }

    /**
     * Converts the team members to an array.
     * @returns {Array} - An array containing all team members.
     */
    toArray() {
        return Array.from(this.members);
    }

    /**
     * Iterates over the team members.
     * This method allows using the for...of loop
     * to iterate through the team's members.
     * @yields {Object} - A team member during each iteration.
     */
    * [Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
        for (const member of this.members) {
            yield member;
        }
    }

    /**
     * Returns a random iterator for selecting team members.
     * This method returns a random member in an infinite loop.
     * @yields {Object} - A random team member during each iteration.
     */
    * randomIterator() {
        while (true) {
            const index = Math.floor(
                Math.random() * this.members.size,
            );
            yield this.toArray()[index];
        }
    }
}
