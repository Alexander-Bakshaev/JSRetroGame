import aiTurn from '../aiTurn';
import setActiveCharacter from '../setActiveCharacter';
import GamePlay from '../GamePlay';

jest.mock('../setActiveCharacter');
jest.mock('../GamePlay', () => ({
    showMessage: jest.fn(),
    removeAllCellListeners: jest
        .fn(),
}));

describe('aiTurn', () => {
    let mockGamePlay;
    let mockGameController;

    beforeEach(() => {
        mockGamePlay = {
            boardSize: 8,
            score: 100,
            showDamage: jest.fn()
                .mockResolvedValue(),
            redrawPositions: jest.fn(),
            deselectAllCells: jest.fn(),
            selectCell: jest.fn(),
            removeAllCellListeners: jest.fn(),
        };
        mockGameController = {
            gamePlay: mockGamePlay,
            userPositionedCharacters: [{
                position: 1,
                character: {
                    health: 50,
                    defence: 20,
                },
            }],
            enemyPositionedCharacters: [{
                position: 10,
                character: {
                    attack: 30,
                    move: [11, 12],
                    levelUp: jest.fn(),
                },
            }],
            stateService: {
                saveRecord: jest.fn(),
            },
            nextLevel: jest.fn(),
            activeCharacter: {
                position: 1,
            },
        };
        setActiveCharacter.mockReturnValue({
            position: 10,
            attack: [1],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        mockGameController.activeCharacter = {
            position: 10,
            character: {
                attack: 30,
            },
        };
    });

    it('Attack if opponent is in range', async () => {
        setActiveCharacter.mockReturnValueOnce({
            position: 10,
            attack: [1],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGamePlay.showDamage)
            .toHaveBeenCalledTimes(1);
        expect(mockGamePlay.showDamage)
            .toHaveBeenCalledWith(1, expect.any(
                Number,
            ));
    });

    it('Move if no opponents are in range', async () => {
        setActiveCharacter.mockReturnValueOnce({
            position: 10,
            attack: [],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGamePlay.redrawPositions)
            .toHaveBeenCalledTimes(1);
    });

    it('Remove opponent and lvl up character if opponent HP is <= 0', async () => {
        mockGameController
            .userPositionedCharacters[0]
            .character.health = 10;
        setActiveCharacter.mockReturnValueOnce({
            position: 10,
            attack: [1],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGameController
            .userPositionedCharacters)
            .toHaveLength(0);
    });

    it('End game if all user characters are defeated', async () => {
        mockGameController
            .userPositionedCharacters[0]
            .character.health = 0;
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(GamePlay.showMessage)
            .toHaveBeenCalledWith(
                'Game over',
            );
        expect(mockGameController.stateService
            .saveRecord)
            .toHaveBeenCalledTimes(1);
        expect(mockGamePlay
            .removeAllCellListeners)
            .toHaveBeenCalledTimes(1);
    });

    it('Deselect active character if opponent is defeated on active position', async () => {
        mockGameController.activeCharacter = {
            position: 1,
        };
        mockGameController
            .userPositionedCharacters[0]
            .character.health = 0;
        setActiveCharacter.mockReturnValueOnce({
            position: 10,
            attack: [1],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGameController.activeCharacter)
            .toBeUndefined();
    });

    it('Deselect all cells if active character isn\'t on the opponent position', async () => {
        mockGameController.activeCharacter = {
            position: 2,
        };
        mockGameController
            .userPositionedCharacters[0]
            .character.health = 0;
        setActiveCharacter.mockReturnValue({
            position: 10,
            attack: [1],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGameController.activeCharacter)
            .toBeDefined();
    });

    it('Call redrawPositions with correct characters after moving', async () => {
        setActiveCharacter.mockReturnValue({
            position: 10,
            attack: [],
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            },
        });
        await aiTurn(
            mockGameController
                .enemyPositionedCharacters[0],
            mockGameController,
        );
        expect(mockGamePlay.redrawPositions)
            .toHaveBeenCalledWith(expect
                .arrayContaining([
                    ...mockGameController
                        .userPositionedCharacters,
                    ...mockGameController
                        .enemyPositionedCharacters,
                ]));
    });
});
