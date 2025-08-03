import Team from './Team';

/**
 * Generates a character instance from the allowedTypes array with
 * a random level between 1 and maxLevel.
 * @param {Array} allowedTypes - An array of character classes to choose from.
 * @param {number} maxLevel - The maximum possible level for a character.
 * @returns {Generator} A generator that, on each call, yields a new instance of a character class.
 */
export function* characterGenerator(allowedTypes, maxLevel) {
    while (true) {
        const randomLevel = Math.floor(
            Math.random() * maxLevel + 1,
        );
        const RandomClass = allowedTypes[
            Math.floor(
                Math.random() * allowedTypes.length,
            )
        ];
        yield new RandomClass(randomLevel);
    }
}

/**
 * Generates an array of characters based on the characterGenerator function.
 * @param {Array} allowedTypes - An array of character classes to choose from.
 * @param {number} maxLevel - The maximum possible level for the characters.
 * @param {number} characterCount - The number of characters to generate.
 * @returns {Team} - An instance of the Team class containing the generated character instances.
 */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
    const team = new Team();
    const characters = Array.from(
        {
            length: characterCount,
        },
        () => characterGenerator(
            allowedTypes,
            maxLevel,
        ).next().value,
    );
    team.addAll(...characters);
    return team;
}
