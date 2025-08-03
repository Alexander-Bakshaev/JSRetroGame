import GameStateService from '../GameStateService';

describe('GameStateService', () => {
    let mockStorage;
    let gameStateService;

    beforeEach(() => {
        mockStorage = {
            setItem: jest.fn(),
            getItem: jest.fn(),
        };
        gameStateService = new GameStateService(mockStorage);
    });

    test('Save state correctly', () => {
        const state = {
            level: 2,
            score: 100,
        };
        gameStateService.save(state);
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'state',
            JSON.stringify(state),
        );
    });

    test('Load state correctly', () => {
        const state = {
            level: 2,
            score: 100,
        };
        mockStorage.getItem.mockReturnValueOnce(
            JSON.stringify(
                state,
            ),
        );
        const loadedState = gameStateService.load();
        expect(loadedState).toEqual(state);
    });

    test('Throw error if state is invalid', () => {
        mockStorage.getItem.mockReturnValueOnce(
            'invalid state',
        );
        expect(() => gameStateService.load()).toThrowError(
            'Invalid state',
        );
    });

    test('Save record correctly', () => {
        const score = 200;
        gameStateService.saveRecord(score);
        expect(mockStorage.setItem).toHaveBeenCalledWith(
            'record',
            score,
        );
    });

    test('Load record correctly', () => {
        const score = 200;
        mockStorage.getItem.mockReturnValueOnce(score);
        const loadedRecord = gameStateService.loadRecord();
        expect(loadedRecord).toBe(score);
    });
});
