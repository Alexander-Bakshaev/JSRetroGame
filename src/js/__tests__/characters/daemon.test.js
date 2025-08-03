import Daemon from '../../characters/Daemon';

test('Create a Daemon', () => {
    const expected = {
        attack: 10,
        attackDistance: 4,
        defence: 10,
        health: 50,
        level: 1,
        moveDistance: 1,
        type: 'Daemon',
    };
    expect(new Daemon(1)).toEqual(expected);
});
