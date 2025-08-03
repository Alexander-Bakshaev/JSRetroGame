import createActiveCharacter from '../setActiveCharacter';
import Bowman from '../characters/Bowman';
import PositionedCharacter from '../PositionedCharacter';

test('Start from 0', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 1;
    bowman.attackDistance = 2;
    const positionedCharacter = new PositionedCharacter(bowman, 0);
    const boardSize = 4;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 1,
                attackDistance: 2,
            },
            position: 0,
            move: [0, 1, 4, 5],
            attack: [0, 1, 2, 4, 5, 6, 8, 9, 10],
        });
});

test('Position in the center', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 2;
    bowman.attackDistance = 2;
    const positionedCharacter = new PositionedCharacter(bowman, 12);
    const boardSize = 5;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 2,
                attackDistance: 2,
            },
            position: 12,
            move: [0, 2, 4, 6, 7, 8, 10, 11, 12,
                13, 14, 16, 17, 18, 20, 22, 24,
            ],
            attack: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            ],
        });
});

test('Position on the right edge', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 1;
    bowman.attackDistance = 2;
    const positionedCharacter = new PositionedCharacter(bowman, 11);
    const boardSize = 4;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 1,
                attackDistance: 2,
            },
            position: 11,
            move: [6, 7, 10, 11, 14, 15],
            attack: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15],
        });
});

test('Position on the left edge', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 1;
    bowman.attackDistance = 2;
    const positionedCharacter = new PositionedCharacter(bowman, 11);
    const boardSize = 5;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 1,
                attackDistance: 2,
            },
            position: 11,
            move: [5, 6, 7, 10, 11, 12, 15, 16, 17],
            attack: [0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12,
                13, 15, 16, 17, 18, 20, 21, 22, 23,
            ],
        });
});

test('Position on the bottom edge', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 4;
    bowman.attackDistance = 4;
    const positionedCharacter = new PositionedCharacter(bowman, 51);
    const boardSize = 8;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({

            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 4,
                attackDistance: 4,
            },
            position: 51,

            move: [19, 23, 24, 27, 30, 33, 35, 37, 42, 43, 44, 48,
                49, 50, 51, 52, 53, 54, 55, 58, 59, 60,
            ],
            attack: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
                52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
            ],
        });
});

test('Place character on the board', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 4;
    bowman.attackDistance = 1;
    const positionedCharacter = new PositionedCharacter(bowman, 16);
    const boardSize = 5;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 4,
                attackDistance: 1,
            },
            position: 16,

            move: [1, 4, 6, 8, 10, 11, 12, 15,
                16, 17, 18, 19, 20, 21, 22,
            ],
            attack: [10, 11, 12, 15, 16, 17, 20, 21, 22],
        });
});

test('Handle duplicate positioning', () => {
    const bowman = new Bowman(1);
    bowman.moveDistance = 1;
    bowman.attackDistance = 4;
    const positionedCharacter = new PositionedCharacter(bowman, 34);
    const boardSize = 8;
    expect(createActiveCharacter(positionedCharacter, boardSize))
        .toEqual({
            character: {
                level: 1,
                attack: 25,
                defence: 25,
                health: 50,
                type: 'Bowman',
                moveDistance: 1,
                attackDistance: 4,
            },
            position: 34,
            move: [25, 26, 27, 33, 34, 35, 41, 42, 43],
            attack: [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14,
                16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27,
                28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 40, 41,
                42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54,
                56, 57, 58, 59, 60, 61, 62,
            ],
        });
});

test('Throw on invalid character position', () => {
    const positionedCharacter = {
        character: {
            moveDistance: 1,
            attackDistance: 4,
        },
        position: 34,
    };
    const boardSize = 8;
    expect(() => createActiveCharacter(positionedCharacter, boardSize))
        .toThrow();
});

test('Throw on invalid board size', () => {
    const bowman = new Bowman(1);
    const positionedCharacter = new PositionedCharacter(bowman, 1);
    const boardSize = 'notBoardSize';
    expect(() => createActiveCharacter(positionedCharacter, boardSize))
        .toThrow();
});
