import Undead from '../../characters/Undead';

test('Create an Undead', () => {
    const expected = {
        attack: 40,
        attackDistance: 1,
        defence: 10,
        health: 50,
        level: 1,
        moveDistance: 4,
        type: 'Undead',
    };
    expect(new Undead(1)).toEqual(expected);
});
