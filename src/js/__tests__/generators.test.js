import { characterGenerator, generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';

describe('characterGenerator', () => {
    let generator;

    beforeEach(() => {
        const allowedTypes = [
            Bowman,
            Daemon,
            Magician,
        ];
        const maxLevel = 10;
        generator = characterGenerator(
            allowedTypes,
            maxLevel,
        );
    });

    test('Yield a character of a random type', () => {
        const character = generator.next().value;
        expect([Bowman, Daemon, Magician]).toContain(character.constructor);
    });

    test('Generate a character with level between 1 and maxLevel', () => {
        const maxLevel = 10;
        const character = generator.next().value;
        expect(character.level).toBeGreaterThanOrEqual(1);
        expect(character.level).toBeLessThanOrEqual(maxLevel);
    });

    test('Keep generating characters on subsequent calls', () => {
        const character1 = generator.next().value;
        const character2 = generator.next().value;
        expect(character1).not.toBe(character2);
    });
});

describe('generateTeam', () => {
    test('Generate a team with the correct number of characters', () => {
        const allowedTypes = [Bowman, Daemon, Magician];
        const maxLevel = 10;
        const characterCount = 5;
        const team = generateTeam(
            allowedTypes,
            maxLevel,
            characterCount,
        );
        expect(team.toArray().length).toBe(characterCount);
    });

    test('Generate characters with random types and levels', () => {
        const allowedTypes = [Bowman, Daemon, Magician];
        const maxLevel = 10;
        const characterCount = 5;
        const team = generateTeam(
            allowedTypes,
            maxLevel,
            characterCount,
        );
        const characters = team.toArray();
        characters.forEach((character) => {
            expect([Bowman, Daemon, Magician])
                .toContain(character.constructor);
            expect(character.level)
                .toBeGreaterThanOrEqual(1);
            expect(character.level).toBeLessThanOrEqual(
                maxLevel,
            );
        });
    });

    test('Generate a team with different characters on each call', () => {
        const allowedTypes = [Bowman, Daemon, Magician];
        const maxLevel = 10;
        const characterCount = 3;
        const team1 = generateTeam(
            allowedTypes,
            maxLevel,
            characterCount,
        );
        const team2 = generateTeam(
            allowedTypes,
            maxLevel,
            characterCount,
        );
        expect(team1).not.toBe(team2);
        expect(team1.toArray()).not.toEqual(team2.toArray());
    });
});
