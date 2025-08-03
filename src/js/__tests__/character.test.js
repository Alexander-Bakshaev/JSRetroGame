import Character from '../Character';
import Bowman from '../characters/Bowman';

test('Create an instance of Character', () => {
    expect(() => new Character(1)).toThrow();
});

test('Create a character with a negative level', () => {
    expect(() => new Bowman(-5)).toThrow();
});

test('Level up the character', () => {
    const bowman = new Bowman(1);
    bowman.levelUp();
    expect(bowman).toEqual({
        attack: 32,
        attackDistance: 2,
        defence: 25,
        health: 80,
        level: 2,
        moveDistance: 2,
        type: 'Bowman',
    });
});

test('Level up with high health (should not exceed 100)', () => {
    const bowman = new Bowman(1);
    bowman.health = 100;
    bowman.levelUp();
    expect(bowman).toEqual({
        attack: 45,
        attackDistance: 2,
        defence: 25,
        health: 100,
        level: 2,
        moveDistance: 2,
        type: 'Bowman',
    });
});

test('Set stats based on the level', () => {
    expect(new Bowman(4)).toEqual({
        attack: 32,
        attackDistance: 2,
        defence: 32,
        health: 50,
        level: 4,
        moveDistance: 2,
        type: 'Bowman',
    });
});

test('Throw an error when trying to level up a dead character', () => {
    const deadCharacter = new Bowman(1, 10, 10);
    deadCharacter.health = 0;
    expect(() => deadCharacter.levelUp()).toThrow(
        'Нельзя повысить уровень умершего',
    );
});
