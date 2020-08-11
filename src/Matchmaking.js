export default class Matchmaking {
    constructor(roomManager) {
        this.roomManager = roomManager;
        this.playersLookingForMatch = {};
        this.interval = undefined;
    }

    run() {
        this.interval = setInterval(this.op.bind(this), 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
 
    op() {
        const playersEntries = Object.entries(this.playersLookingForMatch);
        console.log("Matchmaking -> op -> playersEntries", playersEntries)
        if (playersEntries.length >=2) {
            console.log('START MATCH');
            this.startMatch(playersEntries[0][1], playersEntries[1][1]);
        }
    }

    startMatch(player1, player2) {
        this.removePlayer(player1);
        this.removePlayer(player2);
        this.roomManager.createRoom(player1, player2);
    }

    addPlayer(player) {
        this.playersLookingForMatch[player.id] = player;
    }

    removePlayer(player) {
        delete this.playersLookingForMatch[player.id];
    }
}
