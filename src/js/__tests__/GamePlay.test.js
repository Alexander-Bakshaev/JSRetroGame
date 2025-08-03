import GamePlay from '../GamePlay';

let gamePlay;
let container;

beforeEach(() => {
    container = document.createElement('div');
    container.id = 'game-container';
    document.body.appendChild(container);
    gamePlay = new GamePlay();
    gamePlay.boardEl = document.createElement('div');
    document.body.appendChild(gamePlay.boardEl);
    gamePlay.container = document.createElement('div');
    gamePlay.container.innerHTML = '<div class="message-container"></div>';
    document.body.appendChild(gamePlay.container);
    gamePlay.cells = [
        document.createElement('div'),
    ];
});

afterEach(() => {
    if (container && container.parentNode) {
        document.body.removeChild(container);
    }
    container = null;
    gamePlay = null;
});

describe('GamePlay Class', () => {
    test('Throw error if container is not HTMLElement', () => {
        expect(() => gamePlay.bindToDOM(null)).toThrow(
            'container is not HTMLElement',
        );
    });

    test('Bind to DOM container', () => {
        gamePlay.bindToDOM(container);
        expect(gamePlay.container).toBe(container);
    });

    test('Throw error if not bound to DOM when calling drawUi', () => {
        gamePlay = new GamePlay();
        expect(() => gamePlay.drawUi('theme')).toThrow(
            'GamePlay not bind to DOM',
        );
        gamePlay.bindToDOM(document.createElement('div'));
        expect(() => gamePlay.drawUi('theme')).not.toThrow();
    });

    test('Draw UI with correct theme and grid size', () => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('dark-theme');
        const board = container.querySelector(
            '[data-id=board]',
        );
        expect(board).not.toBeNull();
        expect(board.classList
            .contains('dark-theme'))
            .toBeTruthy();
        expect(board.style
            .getPropertyValue('--grid-columns'))
            .toBe('8');
        expect(board.children.length)
            .toBe(64);
    });

    test('Call listeners when cell events occur', () => {
        const onEnter = jest.fn();
        const onLeave = jest.fn();
        const onClick = jest.fn();
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.addCellEnterListener(onEnter);
        gamePlay.addCellLeaveListener(onLeave);
        gamePlay.addCellClickListener(onClick);
        const firstCell = container.querySelector('.cell');
        firstCell.dispatchEvent(new Event('mouseenter'));
        expect(onEnter).toHaveBeenCalledWith(0);
        firstCell.dispatchEvent(new Event('mouseleave'));
        expect(onLeave).toHaveBeenCalledWith(0);
        firstCell.dispatchEvent(new Event('click'));
        expect(onClick).toHaveBeenCalledWith(0);
    });

    test('Handle button click events', () => {
        const onNewGame = jest.fn();
        const onSaveGame = jest.fn();
        const onLoadGame = jest.fn();
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.addNewGameListener(onNewGame);
        gamePlay.addSaveGameListener(onSaveGame);
        gamePlay.addLoadGameListener(onLoadGame);
        const newGameBtn = container.querySelector(
            '[data-id=action-restart]',
        );
        const saveGameBtn = container.querySelector(
            '[data-id=action-save]',
        );
        const loadGameBtn = container.querySelector(
            '[data-id=action-load]',
        );
        newGameBtn.dispatchEvent(new Event('click'));
        expect(onNewGame).toHaveBeenCalled();
        saveGameBtn.dispatchEvent(new Event('click'));
        expect(onSaveGame).toHaveBeenCalled();
        loadGameBtn.dispatchEvent(new Event('click'));
        expect(onLoadGame).toHaveBeenCalled();
    });

    test('Select and deselect cells correctly', () => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.selectCell(5, 'red');
        const selectedCell = gamePlay.cells[5];
        expect(selectedCell.classList
            .contains('selected-red'))
            .toBeTruthy();
        gamePlay.deselectCell(5);
        expect(selectedCell.classList
            .contains('selected-red'))
            .toBeFalsy();
        gamePlay.selectCell(10, 'yellow');
        gamePlay.deselectAllCells();
        expect(gamePlay.cells[10].classList
            .contains('selected-yellow'))
            .toBeFalsy();
    });

    test('Show modal messages', () => {
        container = document.createElement(
            'div',
        );
        gamePlay = new GamePlay();
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.showModalMessage('Test Message', 'info');
        let messageBox = container.querySelector('.messagebox');
        expect(messageBox).not.toBeNull();
        expect(messageBox.textContent).toBe('Test Message');
        expect(messageBox.classList.contains('info'))
            .toBeTruthy();
        messageBox.remove();
        gamePlay.showModalMessage('Error Message', 'error');
        messageBox = container.querySelector('.messagebox');
        expect(messageBox).not.toBeNull();
        expect(messageBox.textContent).toBe('Error Message');
        expect(messageBox.classList.contains('error'))
            .toBeTruthy();
        messageBox.remove();
        gamePlay.showModalMessage('Default Message');
        messageBox = container.querySelector('.messagebox');
        expect(messageBox).not.toBeNull();
        expect(messageBox.textContent).toBe('Default Message');
        expect(messageBox.classList.contains('info'))
            .toBeTruthy();
        messageBox.remove();
    });

    test('Trigger new game listener on button click', () => {
        const mockListener = jest.fn();
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.addNewGameListener(mockListener);
        gamePlay.newGameEl.click();
        expect(mockListener).toHaveBeenCalledTimes(1);
    });

    test('Show and auto-remove modal message', () => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        jest.useFakeTimers();
        const message = 'Test Message';
        gamePlay.showModalMessage(message, 'info');
        const messageBox = container.querySelector(
            '.messagebox',
        );
        expect(messageBox).toBeTruthy();
        expect(messageBox.textContent).toBe(message);
        jest.advanceTimersByTime(5000);
        expect(container.querySelector('.messagebox'))
            .toBeNull();
        jest.useRealTimers();
    });

    test('Redraw positions correctly', () => {
        const positions = [{
            position: 0,
            character: {
                type: 'orc',
                health: 100,
                level: 2,
                attack: 20,
                defence: 15,
            },
        },
        {
            position: 5,
            character: {
                type: 'elf',
                health: 80,
                level: 3,
                attack: 25,
                defence: 10,
            },
        },
        ];
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        const scoreElement = container.querySelector('.score');
        expect(scoreElement).not.toBeNull();
        gamePlay.redrawPositions(positions);
        const firstCell = container.querySelector(
            '[data-id="board"] .cell:nth-child(1)',
        );
        const secondCell = container.querySelector(
            '[data-id="board"] .cell:nth-child(6)',
        );
        expect(firstCell.querySelector('.character')).not
            .toBeNull();
        expect(firstCell.querySelector('.character').classList
            .contains('orc')).toBeTruthy();
        expect(secondCell.querySelector('.character')).not
            .toBeNull();
        expect(secondCell.querySelector('.character').classList
            .contains('elf')).toBeTruthy();
        expect(scoreElement.querySelector('.score-level')
            .textContent).toContain(
            `Ваш уровень: ${gamePlay.level}`,
        );
        expect(scoreElement.querySelector('.score-current')
            .textContent).toContain(
            `Ваши очки: ${Math.floor(gamePlay.score)}`,
        );
        expect(scoreElement.querySelector('.score-record')
            .textContent).toContain(
            `Текущий рекорд: ${Math.floor(gamePlay.recordScore)}`,
        );
    });

    test('Remove all cell listeners', () => {
        const onEnter = jest.fn();
        const onLeave = jest.fn();
        const onClick = jest.fn();
        gamePlay = new GamePlay();
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        const cell = document.createElement('div');
        cell.classList.add('cell');
        container.querySelector('[data-id="board"]')
            .appendChild(cell);
        gamePlay.addCellEnterListener(onEnter);
        gamePlay.addCellLeaveListener(onLeave);
        gamePlay.addCellClickListener(onClick);
        gamePlay.removeAllCellListeners();
        const firstCell = container.querySelector('.cell');
        firstCell.dispatchEvent(new Event('mouseenter'));
        firstCell.dispatchEvent(new Event('mouseleave'));
        firstCell.dispatchEvent(new Event('click'));
        expect(onEnter).not.toHaveBeenCalled();
        expect(onLeave).not.toHaveBeenCalled();
        expect(onClick).not.toHaveBeenCalled();
    });

    test('Show error message correctly', () => {
        const alertSpy = jest.spyOn(window, 'alert')
            .mockImplementation();
        GamePlay.showError('This is an error!');
        expect(alertSpy).toHaveBeenCalledWith(
            'This is an error!',
        );
        alertSpy.mockRestore();
    });

    test('Show message correctly', () => {
        const alertSpy = jest.spyOn(window, 'alert')
            .mockImplementation();
        GamePlay.showMessage('This is a message!');
        expect(alertSpy).toHaveBeenCalledWith(
            'This is a message!',
        );
        alertSpy.mockRestore();
    });

    test('Show tooltip with character details on cell hover', () => {
        const positionedCharacter = {
            position: 0,
            character: {
                type: 'Knight',
                level: 5,
                attack: 50,
                defence: 30,
                health: 70,
            },
        };
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.showCellTooltip(positionedCharacter);
        const firstCell = container.querySelector('.cell');
        expect(firstCell.title).toBe('Knight\n5⚔5030❤70');
    });

    test('Hide tooltip from cell', () => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.hideCellTooltip(0);
        const firstCell = container.querySelector('.cell');
        expect(firstCell.title).toBe('');
    });

    test('Set cursor style on board container', () => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        gamePlay.setCursor('pointer');
        expect(gamePlay.boardEl.style.cursor).toBe('pointer');
    });

    test('Throw error if container is not bound', () => {
        gamePlay.container = null;
        expect(() => gamePlay.checkBinding()).toThrow(
            'GamePlay not bind to DOM',
        );
    });

    test('Show damage and remove it after animation', (done) => {
        gamePlay.bindToDOM(container);
        gamePlay.drawUi('theme');
        const index = 0;
        const damage = 50;
        const cell = gamePlay.cells[index];
        expect(cell.querySelector('.damage')).toBeNull();
        const promise = gamePlay.showDamage(index, damage);
        const damageEl = cell.querySelector('.damage');
        expect(damageEl).not.toBeNull();
        expect(damageEl.textContent).toBe(damage.toString());
        damageEl.dispatchEvent(new Event('animationend'));
        promise.then(() => {
            expect(cell.querySelector('.damage'))
                .toBeNull();
            done();
        });
    });
});
