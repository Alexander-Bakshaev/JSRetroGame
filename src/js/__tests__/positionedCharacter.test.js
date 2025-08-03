import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';

test('Position character correctly', () => {
    const character = new Bowman(1);
    expect(new PositionedCharacter(character, 1)).toEqual({
        character: {
            attack: 25,
            attackDistance: 2,
            defence: 25,
            health: 50,
            level: 1,
            moveDistance: 2,
            type: 'Bowman',
        },
        position: 1,
    });
});

test('Throw an error for invalid character position', () => {
    const character = new Bowman(1);
    expect(() => new PositionedCharacter(character, 'Bowman'))
        .toThrow();
});

test('Throw an error for invalid character class', () => {
    expect(() => new PositionedCharacter('character', 1)).toThrow();
});
