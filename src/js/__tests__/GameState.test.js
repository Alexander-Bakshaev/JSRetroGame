import GameState from '../GameState';
import Bowman from '../characters/Bowman';
import Daemon from '../characters/Daemon';
import PositionedCharacter from '../PositionedCharacter';

describe('GameState', () => {
    let mockGameController;

    beforeEach(() => {
        mockGameController = {
            gamePlay: {
                level: null,
                boardSize: null,
                score: null,
                deselectAllCells: jest.fn(),
                redrawPositions: jest.fn(),
            },
            userPositionedCharacters: [],
            enemyPositionedCharacters: [],
            activeCharacter: null,
        };
    });

    test('Throw an error if GameController is not passed to the constructor', () => {
        expect(() => new GameState()).toThrow(
            'GameController instance is required',
        );
    });

    test('Create an instance with a valid gameController', () => {
        const gameState = new GameState(mockGameController);
        expect(gameState).toBeInstanceOf(GameState);
        expect(gameState.gameController).toBe(
            mockGameController,
        );
    });

    test('Return positioned characters correctly from getPositionedCharacters', () => {
        const gameState = new GameState(mockGameController);
        const characters = [{
            character: {
                type: 'Bowman',
                level: 2,
                health: 50,
                defence: 25,
                attack: 40,
            },
            position: 0,
        },
        {
            character: {
                type: 'Daemon',
                level: 3,
                health: 40,
                defence: 20,
                attack: 35,
            },
            position: 8,
        },
        ];
        const result = gameState.getPositionedCharacters(
            characters,
        );
        expect(result).toHaveLength(2);
        expect(result[0]).toBeInstanceOf(PositionedCharacter);
        expect(result[0].character).toBeInstanceOf(Bowman);
        expect(result[0].position).toBe(0);
        expect(result[1]).toBeInstanceOf(PositionedCharacter);
        expect(result[1].character).toBeInstanceOf(Daemon);
        expect(result[1].position).toBe(8);
    });

    test('Throw an error for incorrect character type in getPositionedCharacters', () => {
        const gameState = new GameState(mockGameController);
        const characters = [{
            character: {
                type: 'UnknownType',
                level: 1,
                health: 30,
                defence: 10,
                attack: 20,
            },
            position: 2,
        }];
        expect(() => gameState.getPositionedCharacters(
            characters,
        )).toThrow();
    });

    test('Apply state correctly to gameController using from method', () => {
        const gameState = new GameState(mockGameController);
        const state = {
            level: 3,
            boardSize: 8,
            score: 100,
            userPositionedCharacters: [{
                character: {
                    type: 'Bowman',
                    level: 2,
                    health: 50,
                    defence: 25,
                    attack: 40,
                },
                position: 0,
            }],
            enemyPositionedCharacters: [{
                character: {
                    type: 'Daemon',
                    level: 3,
                    health: 40,
                    defence: 20,
                    attack: 35,
                },
                position: 8,
            }],
        };
        gameState.from(state);
        expect(mockGameController.gamePlay.level).toBe(3);
        expect(mockGameController.gamePlay.boardSize).toBe(8);
        expect(mockGameController.gamePlay.score).toBe(100);
        expect(mockGameController.userPositionedCharacters)
            .toHaveLength(1);
        expect(mockGameController.userPositionedCharacters[0])
            .toBeInstanceOf(PositionedCharacter);
        expect(mockGameController.enemyPositionedCharacters)
            .toHaveLength(1);
        expect(mockGameController.enemyPositionedCharacters[0])
            .toBeInstanceOf(PositionedCharacter);
        expect(mockGameController.gamePlay.deselectAllCells)
            .toHaveBeenCalledTimes(1);
        expect(mockGameController.gamePlay.redrawPositions)
            .toHaveBeenCalledWith([
                ...state.userPositionedCharacters,
                ...state.enemyPositionedCharacters,
            ]);
    });

    test('Throw an error if state is null or undefined in from method', () => {
        const gameState = new GameState(mockGameController);
        expect(() => gameState.from(null)).toThrow(
            'Got wrong state',
        );
        expect(() => gameState.from(undefined)).toThrow(
            'Got wrong state',
        );
    });

    test('Throw an error if state data is incorrect in from method', () => {
        const gameState = new GameState(mockGameController);
        const invalidState = {
            level: 3,
            boardSize: 8,
            score: 100,
            userPositionedCharacters: null,
            enemyPositionedCharacters: [],
        };
        expect(() => gameState.from(invalidState)).toThrow(
            'Got wrong state data',
        );
    });
});
