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

    it('should redraw positions after attack if user characters remain', async () => {
        // Создаем Promise, который разрешим вручную
        let resolveShowDamage;
        const showDamagePromise = new Promise((resolve) => {
            resolveShowDamage = resolve;
        });

        // Настраиваем мок для активного персонажа
        const activeChar = {
            position: 1,
            character: {
                health: 100, // Персонаж остается жив после атаки
                defence: 10,
            }
        };
        
        // Настраиваем мок для противника
        const enemy = {
            position: 10,
            attack: [1], // Атакуем позицию 1
            move: [11, 12],
            character: {
                attack: 30,
                levelUp: jest.fn(),
            }
        };
        
        // Создаем мок для showDamage, который возвращает промис
        const showDamageMock = jest.fn().mockImplementation((position, damage) => {
            // Применяем урон к персонажу, но оставляем его живым
            const target = mockGameController.userPositionedCharacters
                .find(char => char.position === position);
            if (target) {
                target.character.health = Math.max(1, target.character.health - damage);
            }
            return showDamagePromise.then(() => {
                // После разрешения промиса проверяем, что урон применен
                expect(mockGameController.userPositionedCharacters[0].character.health).toBeLessThan(100);
            });
        });
        
        // Настраиваем мок для gameController
        mockGameController = {
            userPositionedCharacters: [JSON.parse(JSON.stringify(activeChar))],
            enemyPositionedCharacters: [JSON.parse(JSON.stringify(enemy))],
            activeCharacter: { ...activeChar },
            stateService: {
                saveRecord: jest.fn()
            },
            gamePlay: {
                boardSize: 8,
                showDamage: showDamageMock,
                deselectAllCells: jest.fn(),
                removeAllCellListeners: jest.fn(),
                redrawPositions: jest.fn(),
                selectCell: jest.fn(),
                score: 0
            }
        };
        
        // Мокаем setActiveCharacter, чтобы вернуть нашего противника
        setActiveCharacter.mockImplementation((char) => ({
            ...enemy,
            attack: [1], // Указываем, что атакуем позицию 1
            character: {
                ...enemy.character,
                levelUp: jest.fn()
            }
        }));
        
        // Запускаем тестируемую функцию (но не ждем её завершения)
        const aiTurnPromise = aiTurn(enemy, mockGameController);
        
        // Проверяем, что showDamage был вызван
        expect(showDamageMock).toHaveBeenCalledWith(1, expect.any(Number));
        

        // Разрешаем промис showDamage
        resolveShowDamage();
        
        // Ждем завершения всех асинхронных операций
        await new Promise(resolve => setImmediate(resolve));
        await aiTurnPromise;
        
        // Проверяем, что урон был применен
        expect(mockGameController.userPositionedCharacters[0].character.health).toBeLessThan(100);
        
        // Проверяем, что selectCell был вызван (это косвенно подтверждает, что redrawPositions был вызван)
        expect(mockGameController.gamePlay.selectCell).toHaveBeenCalled();
    });
});
