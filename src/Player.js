import shortId from 'shortid';

export default class Player {
    constructor(conn) {
        this.conn = conn;
        this.username = "";
        this.id = shortId.generate();
        this.room = undefined;
    }

    playTurn({pos}) {
        console.log('PLAY TURN', pos);
        if (this.room) {
            this.room.playTurn(this, pos);
        } else {
            console.error('PLAYER PLAYING WITHOUT ROOM?!')
        }
    }
}
