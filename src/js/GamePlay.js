import { calcHealthLevel, calcTileType } from './utils';

export default class GamePlay {
    /**
     * Creates a new instance of the GamePlay class.
     */
    constructor() {
        this.boardSize = 8;
        this.container = null;
        this.boardEl = null;
        this.cells = [];
        this.cellClickListeners = [];
        this.cellEnterListeners = [];
        this.cellLeaveListeners = [];
        this.newGameListeners = [];
        this.saveGameListeners = [];
        this.loadGameListeners = [];
        this.score = 0;
        this.level = 0;
        this.recordScore = 0;
    }

    /**
     * Binds the game UI to a specific DOM container.
     * @param {HTMLElement} container - The DOM element to bind the game to.
     */
    bindToDOM(container) {
        if (!(container instanceof HTMLElement)) {
            throw new Error('container is not HTMLElement');
        }
        this.container = container;
    }

    /**
     * Draws the game UI, including the game board, score, and controls.
     * @param {string} theme - The theme to apply to the game board (CSS class).
     */
    drawUi(theme) {
        if (!this.container) {
            throw new Error('GamePlay not bind to DOM');
        }
        this.checkBinding();

        this.container.innerHTML = `
            <div class="message-container"></div>
            <div class="controls">
                <div class="buttons">
                    <button data-id="action-restart" class="btn">New Game</button>
                    <button data-id="action-save" class="btn">Save Game</button>
                    <button data-id="action-load" class="btn">Load Game</button>
                </div>
                <div class="score">
                    <div class="score-level">
                        Ваш уровень: ${this.level} 
                    </div>
                    <div class="score-current">
                        Ваши очки: ${Math.floor(this.score)} 
                    </div>
                    <div class="score-record">
                        Текущий рекорд: ${Math.floor(this.recordScore)}
                    </div>
                </div>
            </div>
            
            <div class="board-container">
                <div data-id="board" class="board"></div>
            </div>
        `;

        this.newGameEl = this.container.querySelector(
            '[data-id=action-restart]',
        );
        this.saveGameEl = this.container.querySelector(
            '[data-id=action-save]',
        );
        this.loadGameEl = this.container.querySelector(
            '[data-id=action-load]',
        );

        this.newGameEl.addEventListener('click', (event) => this
            .onNewGameClick(event));
        this.saveGameEl.addEventListener('click', (event) => this
            .onSaveGameClick(event));
        this.loadGameEl.addEventListener('click', (event) => this
            .onLoadGameClick(event));

        this.boardEl = this.container.querySelector(
            '[data-id=board]',
        );
        this.boardEl.classList.add(theme);
        this.boardEl.style.setProperty(
            '--grid-columns',
            this.boardSize,
        );

        for (let i = 0; i < this.boardSize ** 2; i += 1) {
            const cellEl = document.createElement('div');

            cellEl.classList.add(
                'cell',
                'map-tile',
                `map-tile-${calcTileType(i, this.boardSize)}`,
            );

            cellEl.addEventListener(
                'mouseenter',
                (event) => this.onCellEnter(event),
            );
            cellEl.addEventListener(
                'mouseleave',
                (event) => this.onCellLeave(event),
            );
            cellEl.addEventListener(
                'click',
                (event) => this.onCellClick(event),
            );

            this.boardEl.appendChild(cellEl);
        }

        this.cells = Array.from(this.boardEl.children);
    }

    /**
     * Redraws the positions of the characters on the board.
     * @param {Array} positions - An array of character
     * positions to update the UI with.
     */
    redrawPositions(positions) {
    /* eslint-disable no-restricted-syntax */
        for (const cell of this.cells) {
            cell.innerHTML = '';
        }

        /* eslint-disable no-restricted-syntax */
        for (const position of positions) {
            const cellEl = this.boardEl.children[position.position];
            const charEl = document.createElement('div');
            charEl.classList.add(
                'character',
                position.character.type,
            );

            const healthEl = document.createElement('div');
            healthEl.classList.add('health-level');

            const healthIndicatorEl = document.createElement('div');
            healthIndicatorEl.classList.add(
                'health-level-indicator',
                `health-level-indicator-${calcHealthLevel(position.character.health)}`,
            );
            healthIndicatorEl.style.width = `${position.character.health}%`;

            healthEl.appendChild(healthIndicatorEl);
            charEl.appendChild(healthEl);
            cellEl.appendChild(charEl);

            document.querySelector('.score')
                .innerHTML = `
                    <div class="score-level">
                        Ваш уровень: ${this.level} 
                    </div>
                    <div class="score-current">
                        Ваши очки: ${Math.floor(this.score)} 
                    </div>
                    <div class="score-record">
                        Текущий рекорд: ${Math.floor(this.recordScore)}
                    </div>
                `;
        }
    }

    /**
     * Adds a listener for cell mouseenter events.
     * @param {Function} callback - The function to be called on mouseenter.
     */
    addCellEnterListener(callback) {
        this.cellEnterListeners.push(callback);
    }

    /**
     * Adds a listener for cell mouseleave events.
     * @param {Function} callback - The function to be called on mouseleave.
     */
    addCellLeaveListener(callback) {
        this.cellLeaveListeners.push(callback);
    }

    /**
     * Adds a listener for cell click events.
     * @param {Function} callback - The function to be called on cell click.
     */
    addCellClickListener(callback) {
        this.cellClickListeners.push(callback);
    }

    /**
     * Removes all cell event listeners (mouseenter, mouseleave, click).
     */
    removeAllCellListeners() {
        this.cellEnterListeners = [];
        this.cellLeaveListeners = [];
        this.cellClickListeners = [];
    }

    /**
     * Adds a listener for new game events.
     * @param {Function} callback - The function to be called on new game event.
     */
    addNewGameListener(callback) {
        this.newGameListeners.push(callback);
    }

    /**
     * Adds a listener for save game events.
     * @param {Function} callback - The function to be called on save game event.
     */
    addSaveGameListener(callback) {
        this.saveGameListeners.push(callback);
    }

    /**
     * Adds a listener for load game events.
     * @param {Function} callback - The function to be called on load game event.
     */
    addLoadGameListener(callback) {
        this.loadGameListeners.push(callback);
    }

    /**
     * Handles cell mouseenter events.
     * @param {Event} event - The event object for the mouseenter event.
     */
    onCellEnter(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellEnterListeners.forEach(
            (o) => o.call(null, index),
        );
    }

    /**
     * Handles cell mouseleave events.
     * @param {Event} event - The event object for the mouseleave event.
     */
    onCellLeave(event) {
        event.preventDefault();
        const index = this.cells.indexOf(event.currentTarget);
        this.cellLeaveListeners.forEach(
            (o) => o.call(null, index),
        );
    }

    /**
     * Handles cell click events.
     * @param {Event} event - The event object for the click event.
     */
    onCellClick(event) {
        const index = this.cells.indexOf(event.currentTarget);
        this.cellClickListeners.forEach(
            (o) => o.call(null, index),
        );
    }

    /**
     * Handles new game button click events.
     * @param {Event} event - The event object for the button click event.
     */
    onNewGameClick(event) {
        event.preventDefault();
        this.newGameListeners.forEach(
            (o) => o.call(null),
        );
    }

    /**
     * Handles save game button click events.
     * @param {Event} event - The event object for the button click event.
     */
    onSaveGameClick(event) {
        event.preventDefault();
        this.saveGameListeners.forEach(
            (o) => o.call(null),
        );
    }

    /**
     * Handles load game button click events.
     * @param {Event} event - The event object for the button click event.
     */
    onLoadGameClick(event) {
        event.preventDefault();
        this.loadGameListeners.forEach(
            (o) => o.call(null),
        );
    }

    /**
     * Displays an error message as an alert.
     * @param {string} message - The message to display in the alert.
     */
    static showError(message) {
    // eslint-disable-next-line no-alert
        alert(message);
    }

    /**
     * Displays a message as an alert.
     * @param {string} message - The message to display in the alert.
     */
    static showMessage(message) {
    // eslint-disable-next-line no-alert
        alert(message);
    }

    /**
     * Selects a specific cell and applies a color to it.
     * @param {number} index - The index of the cell to select.
     * @param {string} [color='yellow'] - The color to apply to the selected cell.
     */
    selectCell(index, color = 'yellow') {
        this.deselectCell(index);
        this.cells[index].classList.add(
            'selected',
            `selected-${color}`,
        );
    }

    /**
     * Deselects a specific cell.
     * @param {number} index - The index of the cell to deselect.
     */
    deselectCell(index) {
        const cell = this.cells[index];
        cell.classList.remove(...Array.from(cell.classList)
            .filter(
                (o) => o.startsWith('selected'),
            ));
    }

    /**
     * Deselects all selected cells.
     */
    deselectAllCells() {
        this.cells.forEach((cell) => {
            cell.classList.remove(...Array.from(cell.classList)
                .filter(
                    (o) => o.startsWith('selected'),
                ));
        });
    }

    /**
     * Displays a tooltip on a specific cell showing information about a character.
     * @param {PositionedCharacter} positionedCharacter - The character to display the tooltip.
     */
    showCellTooltip(positionedCharacter) {
        const char = positionedCharacter.character;
        this.cells[positionedCharacter.position]
            .title = `${char.type}\n${char.level}⚔${char.attack}${char.defence}❤${char.health}`;
    }

    /**
     * Hides the tooltip for a specific cell.
     * @param {number} index - The index of the cell to hide the tooltip for.
     */
    hideCellTooltip(index) {
        this.cells[index].title = '';
    }

    /**
     * Displays a damage value on a specific cell.
     * @param {number} index - The index of the cell to display the damage in.
     * @param {number} damage - The damage value to display.
     * @returns {Promise} A promise that resolves when the damage animation ends.
     */
    showDamage(index, damage) {
        return new Promise((resolve) => {
            const cell = this.cells[index];
            const damageEl = document.createElement('span');

            damageEl.textContent = damage;
            damageEl.classList.add('damage');

            cell.appendChild(damageEl);

            damageEl.addEventListener('animationend', () => {
                cell.removeChild(damageEl);
                resolve();
            });
        });
    }

    /**
     * Sets the cursor style for the game board.
     * @param {string} cursor - The cursor style to set (e.g., 'pointer', 'default').
     */
    setCursor(cursor) {
        this.boardEl.style.cursor = cursor;
    }

    /**
     * Checks if the game is properly bound to the DOM.
     * @throws {Error} Throws an error if the GamePlay instance is not bound to the DOM.
     */
    checkBinding() {
        if (this.container === null) {
            throw new Error('GamePlay not bind to DOM');
        }
    }

    /**
     * Displays a modal message on the screen.
     * @param {string} message - The message to display in the modal.
     * @param {string} [type='info'] - The type of the message ('info', 'error').
     */
    showModalMessage(message, type = 'info') {
        const messageContainer = this.container.querySelector(
            '.message-container',
        );

        if (messageContainer) {
            const messageBox = document.createElement('div');
            messageBox.classList.add('messagebox');
            messageBox.textContent = message;

            switch (type) {
                case 'info':
                    messageBox.classList.add('info');
                    break;
                case 'error':
                    messageBox.classList.add('error');
                    break;
                default:
                    break;
            }

            messageContainer.appendChild(messageBox);

            setTimeout(() => {
                messageBox.remove();
            }, 5000);
        }
    }
}
