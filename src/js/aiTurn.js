import GamePlay from './GamePlay';
import setActiveCharacter from './setActiveCharacter';

/**
 * Handles the AI turn, allowing enemy characters to either attack or move.
 * @param {PositionedCharacter} positionedCharacter - The active enemy character taking the turn.
 * @param {Object} obj - The context for the game state (GamePlay or GameController).
 * @param {GamePlay} obj.gamePlay - The gamePlay object responsible for UI updates.
 * @param {GameController} obj.gameController - The game controller object managing the game logic.
 */
export default function aiTurn(positionedCharacter, obj) {
    const { gamePlay } = obj;
    const gameController = obj;

    const enemyActiveCharacter = setActiveCharacter(
        positionedCharacter,
        gamePlay.boardSize,
    );

    const opponentCharacter = gameController.userPositionedCharacters
        .filter((character) => enemyActiveCharacter.attack.includes(character.position))
        .sort((a, b) => a.character.health - b.character.health)[0];

    if (opponentCharacter) {
        const damage = Math.floor(
            Math.max(
                enemyActiveCharacter.character.attack
                - opponentCharacter.character.defence,
                enemyActiveCharacter.character.attack * 0.1,
            ),
        );

        gamePlay.showDamage(opponentCharacter.position, damage).then(() => {
            opponentCharacter.character.health -= damage;
            gamePlay.score -= damage;

            if (opponentCharacter.character.health <= 0) {
                enemyActiveCharacter.character.levelUp();
                if (opponentCharacter.position === gameController.activeCharacter.position) {
                    gamePlay.score -= opponentCharacter.character.defence;
                    gameController.activeCharacter = undefined;
                    gamePlay.deselectAllCells();
                }

                gameController.userPositionedCharacters
                    .splice(gameController.userPositionedCharacters
                        .indexOf(opponentCharacter), 1);

                if (!gameController.userPositionedCharacters.length) {
                    GamePlay.showMessage('Game over');
                    gameController.stateService.saveRecord(GamePlay.recordScore);
                    gameController.gamePlay.removeAllCellListeners();
                } else {
                    gamePlay.redrawPositions([
                        ...gameController.userPositionedCharacters,
                        ...gameController.enemyPositionedCharacters,
                    ]);
                }
            }

            if (gameController.activeCharacter) {
                gamePlay.selectCell(gameController.activeCharacter.position);
            } else {
                gamePlay.deselectAllCells();
            }
        });
        return;
    }

    const isPositionOccupied = (position, characterArray) => characterArray
        .some((positionCharacter) => positionCharacter.position === position);

    const movingPlaces = enemyActiveCharacter.move.filter((movingPlace) => {
        const isOccupied = isPositionOccupied(
            movingPlace,
            gameController.userPositionedCharacters,
        )
      || isPositionOccupied(movingPlace, gameController
          .enemyPositionedCharacters);
        return !isOccupied;
    });

    const movingPlace = movingPlaces[
        Math.floor(
            Math.random() * movingPlaces.length,
        )
    ];

    const indexToUpdate = gameController.enemyPositionedCharacters
        .findIndex((character) => character.position === enemyActiveCharacter.position);

    gameController.enemyPositionedCharacters[indexToUpdate].position = movingPlace;
    gamePlay.redrawPositions([
        ...gameController.userPositionedCharacters,
        ...gameController.enemyPositionedCharacters,
    ]);
}
