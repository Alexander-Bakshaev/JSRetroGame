import Bowman from '../../characters/Bowman';

test('Create a Bowman', () => {
    const expected = {
        attack: 25,
        attackDistance: 2,
        defence: 25,
        health: 50,
        level: 1,
        moveDistance: 2,
        type: 'Bowman',
    };
    expect(new Bowman(1)).toEqual(expected);
});
