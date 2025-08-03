import { calcTileType, calcHealthLevel } from '../utils';

describe('calcTileType', () => {
    test('Return top-left for index 0', () => {
        expect(calcTileType(0, 8)).toBe('top-left');
    });

    test('Return top for indices in the top row (excluding corners)', () => {
        expect(calcTileType(1, 8)).toBe('top');
        expect(calcTileType(6, 8)).toBe('top');
    });

    test('Return top-right for the last index in the top row', () => {
        expect(calcTileType(7, 8)).toBe('top-right');
    });

    test('Return left for indices in the left column (excluding corners)', () => {
        expect(calcTileType(8, 8)).toBe('left');
        expect(calcTileType(16, 8)).toBe('left');
    });

    test('Return right for indices in the right column (excluding corners)', () => {
        expect(calcTileType(15, 8)).toBe('right');
        expect(calcTileType(23, 8)).toBe('right');
    });

    test('Return bottom-left for the first index in the bottom row', () => {
        expect(calcTileType(56, 8)).toBe('bottom-left');
    });

    test('Return bottom for indices in the bottom row (excluding corners)', () => {
        expect(calcTileType(57, 8)).toBe('bottom');
        expect(calcTileType(62, 8)).toBe('bottom');
    });

    test('Return bottom-right for the last index in the bottom row', () => {
        expect(calcTileType(63, 8)).toBe('bottom-right');
    });

    test('Return center for indices not on the edges', () => {
        expect(calcTileType(27, 8)).toBe('center');
        expect(calcTileType(34, 8)).toBe('center');
    });
});

describe('calcHealthLevel', () => {
    test('Return critical for health < 15', () => {
        expect(calcHealthLevel(10)).toBe('critical');
        expect(calcHealthLevel(0)).toBe('critical');
    });

    test('Return normal for health between 15 and 50', () => {
        expect(calcHealthLevel(20)).toBe('normal');
        expect(calcHealthLevel(49)).toBe('normal');
    });

    test('Return high for health >= 50', () => {
        expect(calcHealthLevel(50)).toBe('high');
        expect(calcHealthLevel(100)).toBe('high');
    });
});
