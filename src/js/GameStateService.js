export default class GameStateService {
    /**
     * Initializes the service with the given storage object.
     * @param {Storage} storage - The storage object where game
     * state and record are persisted (e.g., localStorage).
     */
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Saves the current game state to storage.
     * @param {Object} state - The game state to be saved.
     */
    save(state) {
        this.storage.setItem(
            'state',
            JSON.stringify(state),
        );
    }

    /**
     * Loads the saved game state from storage.
     * @returns {Object} - The loaded game state.
     */
    load() {
        try {
            return JSON.parse(
                this.storage.getItem('state'),
            );
        } catch (e) {
            throw new Error(
                'Invalid state',
            );
        }
    }

    /**
     * Saves game record to storage.
     * @param {number} score - The score to be saved.
     */
    saveRecord(score) {
        this.storage.setItem(
            'record',
            score,
        );
    }

    /**
     * Loads game record from storage.
     * @returns {number} - The score to be loaded.
     */
    loadRecord() {
        return this.storage.getItem(
            'record',
        );
    }
}
