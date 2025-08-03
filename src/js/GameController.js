import aiTurn from './aiTurn';
import themes from './themes';
import cursors from './cursors';
import GameState from './GameState';
import { generateTeam } from './generators';
import setActiveCharacter from './setActiveCharacter';
import PositionedCharacter from './PositionedCharacter';

import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Zombie from './characters/Zombie';

export default class GameController {
    /**
     * Constructs a new GameController instance.
     * @param {GamePlay} gamePlay - The gamePlay object responsible for UI interactions.
     * @param {StateService} stateService - Service for saving and loading game states.
     */
    constructor(gamePlay, stateService) {
        this.gamePlay = gamePlay;
        this.stateService = stateService;
        this.userTypeCharacters = [
            Bowman,
            Swordsman,
            Magician,
        ];
        this.enemyTypeCharacters = [
            Undead,
            Daemon,
            Zombie,
        ];
        this.activeCharacter = undefined;
        this.characterCount = 2;
    }

    /**
     * Starts a new game by resetting game state, initializing
     * listeners, and advancing to the first level.
     */
    newGame() {
        this.gamePlay.removeAllCellListeners();
        this.gamePlay.level = 0;
        this.characterCount = 2;
        this.gamePlay.score = 0;
        this.nextLevel();

        this.gamePlay.addCellEnterListener((index) => {
            this.onCellEnter(index);
        });
        this.gamePlay.addCellLeaveListener((index) => {
            this.onCellLeave(index);
        });
        this.gamePlay.addCellClickListener((index) => {
            this.onCellClick(index);
        });
    }

    /**
     * Initializes the game, setting up UI event
     * listeners and loading saved state if available.
     */
    init() {
        this.gamePlay.recordScore = this.stateService.loadRecord();
        this.newGame();

        this.gamePlay.addNewGameListener(() => {
            this.newGame();
            this.gamePlay.showModalMessage(
                'Новая игра загружена',
            );
        });

        this.gamePlay.addSaveGameListener(() => {
            const state = {
                level: this.gamePlay.level,
                boardSize: this.gamePlay.boardSize,
                userPositionedCharacters: this.userPositionedCharacters,
                enemyPositionedCharacters: this.enemyPositionedCharacters,
                score: this.gamePlay.score,
            };
            this.stateService.save(state);
            this.gamePlay.showModalMessage(
                'Игра сохранена',
            );
        });

        this.gamePlay.addLoadGameListener(() => {
            new GameState(this).from(this.stateService.load());
            this.gamePlay.showModalMessage(
                'Игра загружена',
            );
        });
    }

    /**
     * Handles cell click events for user
     * interactions such as selecting characters,
     * moving them, or attacking enemies.
     * @param {number} index - The index of the clicked cell.
     */
    onCellClick(index) {
        let userSelectedCharacter = this.userPositionedCharacters.find(
            (character) => character.position === index,
        );

        if (userSelectedCharacter) {
            if (this.activeCharacter?.position === index) {
                this.gamePlay.deselectCell(index);
                this.activeCharacter = undefined;
            } else {
                this.gamePlay.deselectAllCells();
                this.gamePlay.selectCell(index);
                this.activeCharacter = setActiveCharacter(
                    userSelectedCharacter,
                    this.gamePlay.boardSize,
                );
            }
            return;
        }

        const enemyPositionedCharacter = this.enemyPositionedCharacters
            .find((character) => character.position === index);

        if (enemyPositionedCharacter) {
            if (this.activeCharacter) {
                if (this.activeCharacter.attack.includes(index)) {
                    const attacker = this.activeCharacter.character.attack;

                    const damage = Math.floor(Math.max(
                        attacker - enemyPositionedCharacter.character.defence,
                        attacker * 0.1,
                    ));

                    this.gamePlay.showDamage(index, damage).then(() => {
                        enemyPositionedCharacter.character.health -= damage;
                        this.gamePlay.score += damage;

                        if (enemyPositionedCharacter.character.health <= 0) {
                            this.gamePlay.score += enemyPositionedCharacter.character.defence;
                            this.activeCharacter.character.levelUp();

                            this.enemyPositionedCharacters.splice(
                                this.enemyPositionedCharacters
                                    .indexOf(enemyPositionedCharacter),
                                1,
                            );

                            if (!this.enemyPositionedCharacters.length) {
                                this.nextLevel();
                                return;
                            }
                        }

                        this.gamePlay.redrawPositions([
                            ...this
                                .userPositionedCharacters,
                            ...this
                                .enemyPositionedCharacters,
                        ]);

                        aiTurn(enemyPositionedCharacter, this);
                    });
                } else {
                    this.gamePlay.showModalMessage(
                        'Выбраный персонаж не может атаковать указанного противника',
                        'error',
                    );
                }
            }
            return;
        }

        if (this.activeCharacter?.move.includes(index)) {
            this.gamePlay.deselectCell(
                this.activeCharacter.position,
            );

            userSelectedCharacter = this.userPositionedCharacters
                .find((positionedCharacter) => positionedCharacter
                    .position === this.activeCharacter.position);

            userSelectedCharacter.position = index;

            this.gamePlay.redrawPositions([
                ...this.userPositionedCharacters,
                ...this.enemyPositionedCharacters,
            ]);

            this.activeCharacter = setActiveCharacter(
                userSelectedCharacter,
                this.gamePlay.boardSize,
            );

            this.gamePlay.selectCell(index);

            const randomIndex = Math.floor(
                Math.random() * this.enemyPositionedCharacters.length,
            );

            aiTurn(
                this.enemyPositionedCharacters[randomIndex],
                this,
            );
        } else if (this.activeCharacter) {
            this.gamePlay.showModalMessage(
                'Выбраный персонаж не может переместиться в указанную зону',
                'error',
            );
        }
    }

    /**
     * Handles mouse enter events for game cells, updating
     * the cursor and highlighting valid moves or attacks.
     * @param {number} index - The index of the cell the mouse entered.
     */
    onCellEnter(index) {
        const enemyPositionedCharacter = this.enemyPositionedCharacters
            .find((character) => character.position === index);

        const userPositionedCharacter = this.userPositionedCharacters
            .find((character) => character.position === index);

        if (this.activeCharacter) {
            this.gamePlay.deselectAllCells();
            this.gamePlay.selectCell(this.activeCharacter.position);

            if (enemyPositionedCharacter && this.activeCharacter.attack
                .includes(index)) {
                this.gamePlay.setCursor(cursors.crosshair);
                this.gamePlay.selectCell(index, 'red');
            } else if (userPositionedCharacter) {
                this.gamePlay.setCursor(cursors.pointer);
            } else if (!enemyPositionedCharacter
              && !userPositionedCharacter
              && this.activeCharacter.move.includes(index)
            ) {
                this.gamePlay.setCursor(cursors.pointer);
                this.gamePlay.selectCell(index, 'green');
            } else {
                this.gamePlay.setCursor(cursors.notallowed);
            }
        }

        if (enemyPositionedCharacter) {
            this.gamePlay.showCellTooltip(enemyPositionedCharacter);
        }

        if (userPositionedCharacter) {
            this.gamePlay.showCellTooltip(userPositionedCharacter);
        }
    }

    /**
     * Handles mouse leave events for game cells,
     * clearing tooltips and resetting the cursor.
     * @param {number} index - The index of the cell the mouse left.
     */
    onCellLeave(index) {
        this.gamePlay.hideCellTooltip(index);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
    }

    /**
     * Advances the game to the next level, resetting
     * characters and updating the UI theme.
     */
    nextLevel() {
        this.gamePlay.level += 1;
        this.characterCount += 1;
        this.activeCharacter = undefined;

        this.gamePlay.drawUi(
            Object.values(themes)[
                (this.gamePlay.level - 1) % 4
            ],
        );

        this.userTeam = generateTeam(
            this.userTypeCharacters,
            this.gamePlay.level,
            this.characterCount,
        );

        this.enemyTeam = generateTeam(
            this.enemyTypeCharacters,
            this.gamePlay.level,
            this.characterCount,
        );

        const userTeam = this.startPositionList(
            this.userTeam,
            'user',
        );

        const enemyTeam = this.startPositionList(
            this.enemyTeam,
            'enemy',
        );

        this.userPositionedCharacters = userTeam || [];
        this.enemyPositionedCharacters = enemyTeam || [];
        this.gamePlay.deselectAllCells();

        this.gamePlay.redrawPositions([
            ...this.userPositionedCharacters,
            ...this.enemyPositionedCharacters,
        ]);
    }

    /**
     * Generates starting positions for a team of characters on the board.
     * @param {Team} team - The team of characters to position.
     * @param {string} typeOfTeam - The type of team ('user' or 'enemy').
     * @param {number} [size=this.gamePlay.boardSize] - The size of the game board.
     * @returns {PositionedCharacter[]} Array of PositionedCharacter objects with
     * assigned positions.
     */
    startPositionList(team, typeOfTeam, size = this.gamePlay.boardSize) {
        const col = (typeOfTeam === 'user') ? 0 : size - 2;
        const startArray = [];

        for (let i = col; i < size ** 2 - 1; i += size) {
            startArray.push(i);
            startArray.push(i + 1);
        }

        return team.toArray().map((character) => {
            const position = startArray[
                Math.floor(
                    Math.random() * startArray.length,
                )
            ];

            startArray.splice(startArray.indexOf(position), 1);
            return new PositionedCharacter(character, position);
        });
    }
}
