import Swordsman from '../../characters/Swordsman';

test('Create a Swordsman', () => {
    const expected = {
        attack: 40,
        attackDistance: 1,
        defence: 10,
        health: 50,
        level: 1,
        moveDistance: 4,
        type: 'Swordsman',
    };
    expect(new Swordsman(1)).toEqual(expected);
});
