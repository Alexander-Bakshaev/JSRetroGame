import Zombie from '../../characters/Zombie';

test('Create a Zombie', () => {
    const expected = {
        attack: 10,
        attackDistance: 1,
        defence: 25,
        health: 50,
        level: 1,
        moveDistance: 1,
        type: 'Zombie',
    };
    expect(new Zombie(1)).toEqual(expected);
});
