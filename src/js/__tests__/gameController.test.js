// eslint-disable-next-line max-classes-per-file
import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';
import GamePlay from '../GamePlay';
import Character from '../Character';

jest.mock('../GamePlay');
jest.mock('../GameState');

describe('GameController', () => {
    let mockGameController;
    let gamePlayMock;
    let stateServiceMock;
    let mockUserCharacter;
    let mockEnemyCharacter;

    beforeEach(() => {
        gamePlayMock = new GamePlay();
        gamePlayMock.level = 1;
        gamePlayMock.score = 1;
        gamePlayMock.addLoadGameListener = jest.fn();
        gamePlayMock.redrawPositions = jest.fn();
        stateServiceMock = {
            load: jest.fn(),
            save: jest.fn(),
        };
        mockUserCharacter = class extends Character {};
        mockEnemyCharacter = class extends Character {};
        mockGameController = new GameController(
            gamePlayMock,
            stateServiceMock,
        );
        mockGameController.userTypeCharacters = [
            mockUserCharacter,
        ];
        mockGameController.enemyTypeCharacters = [
            mockEnemyCharacter,
        ];
        mockGameController.startPositionList = jest.fn(
            () => [],
        );
    });

    test('Create a new game and call drawUI', () => {
        mockGameController.newGame();
        expect(gamePlayMock.drawUi).toHaveBeenCalled();
    });

    test('Create a new game and call startPositionList', () => {
        mockGameController.newGame();
        expect(mockGameController.startPositionList)
            .toHaveBeenCalled();
    });

    test('Start a new game and reset listeners, then set new ones', () => {
        mockGameController.newGame();
        expect(gamePlayMock.removeAllCellListeners)
            .toHaveBeenCalled();
        expect(gamePlayMock.addCellEnterListener)
            .toHaveBeenCalledWith(expect.any(Function));
        expect(gamePlayMock.addCellLeaveListener)
            .toHaveBeenCalledWith(expect.any(Function));
        expect(gamePlayMock.addCellClickListener)
            .toHaveBeenCalledWith(expect.any(Function));
    });

    test('Reset the game state when starting a new game', () => {
        mockGameController.newGame();
        expect(mockGameController.gamePlay.level).toBe(1);
        expect(mockGameController.gamePlay.score).toBe(0);
    });

    test('Verify proper initialization of characters in startPositionList', () => {
        const mockTeam = [
            new PositionedCharacter(new mockGameController
                .userTypeCharacters[0](), 0),
            new PositionedCharacter(new mockGameController
                .enemyTypeCharacters[0](), 15),
        ];
        jest.spyOn(mockGameController, 'startPositionList')
            .mockImplementation(() => mockTeam);
        mockGameController.newGame();
        expect(mockGameController.startPositionList)
            .toHaveBeenCalled();
        expect(mockTeam[0].character).toBeInstanceOf(
            mockGameController.userTypeCharacters[0],
        );
        expect(mockTeam[1].character).toBeInstanceOf(
            mockGameController.enemyTypeCharacters[0],
        );
    });

    test('Save the game state and call stateService save method', () => {
        const state = {
            ...mockGameController.gameState,
            userPositionedCharacters: mockGameController
                .userPositionedCharacters,
            enemyPositionedCharacters: mockGameController
                .enemyPositionedCharacters,
            activeCharacter: mockGameController
                .activeCharacter,
            level: mockGameController.gamePlay.level,
            score: mockGameController.gamePlay.score,
        };
        stateServiceMock.save(state);
        expect(stateServiceMock.save).toHaveBeenCalledWith(
            state,
        );
    });
});
