export default class RoomManager {
    constructor() {
        this.rooms = {};
    }

    createRoom(player1, player2) {
        console.log('CREATE ROOM WITH PLAYERS', player1.id, player2.id);
        const room = new Room(player1, player2);
        this.rooms[player1.id] = room;
        this.rooms[player2.id] = room;
    }
}

class Room {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.playerTurn = 0;
        this.gameFinished = false;

        this.player1.room = this;
        this.player2.room = this;

        this.player1.conn.emit('gameStart');
        this.player2.conn.emit('gameStart');

        this.board = [
            null, null, null,
            null, null, null,
            null, null, null,
        ];
    }

    canPlayTurn(player) {
        if (this.gameFinished) return false;

        if (this.playerTurn % 2 === 0) {
            console.log('canPlayTurn 1', player.id === this.player1.id);
            return player.id === this.player1.id;
        } else {
            console.log('canPlayTurn 2', player.id === this.player2.id);
            return player.id === this.player2.id;
        }
    }

    canPlayPos(pos) {
        console.log("canPlayPos", !this.board[pos]);
        return !this.board[pos];
    }

    checkPlayerWins() {
        const possibilities = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            
            [0,3,6],
            [1,4,7],
            [2,5,8],

            [0,4,8],
            [2,4,6],
        ]

        for (const [a,b,c] of possibilities) {
            if (this.board[a] == this.board[b] == this.board[c]) {
                return this.getPlayerByPos(a);
            }
        }
    }

    getPlayerByPos(pos) {
        console.log(this.board);
        const num = this.board[pos];
        if (num) {
            return num == 1 ? this.player1 : this.player2;
        }
    }

    playTurn(player, pos) {
        if (this.canPlayTurn(player) && this.canPlayPos(pos)) {
            this.board[pos] = player.id === this.player1.id ? 1 : 2;
            this.playerTurn++;

            this.player1.conn.emit('play', {pos, id: player.id});
            this.player2.conn.emit('play', {pos, id: player.id});

            console.log(`SEND PLAYERS play ${pos}`);

            const winnerPlayer = this.checkPlayerWins();
            if (winnerPlayer) {
                this.gameFinished = true;
                this.player1.conn.emit('endGame', {id: winnerPlayer.id});
                this.player2.conn.emit('endGame', {id: winnerPlayer.id});
            }
        }
    }
}
