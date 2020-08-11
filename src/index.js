import io from 'socket.io'
import Player from './Player';
import Matchmaking from './Matchmaking';
import RoomManager from './RoomManager';

const roomManager = new RoomManager();
const matchmaking = new Matchmaking(roomManager);
matchmaking.run();

let players = {};

const socket = io(process.env.PORT || 52300);

socket.on('connection', conn => {
    const player = new Player(conn);

    players[player.id] = player;
    console.log(`Player ${player.id} has joined!`);
    
    conn.emit('register', {id: player.id});

    conn.on('turn', (data) => {
        console.log(`Player ${player.id} has played a turn! ${data}`);
        player.playTurn(data);
    });

    conn.on('disconnect', () => {
        console.log(`Player ${player.id} has left!`);
        delete players[player.id];
        matchmaking.removePlayer(player);

        // TODO, disconect room
    });

    conn.on('findMatch', () => {
        console.log(`Player ${player.id} is trying to find match...`);
        matchmaking.addPlayer(player);
    });

    conn.on('cancelFindMatch', () => {
        console.log(`Player ${player.id} timeout find match...`);
        matchmaking.removePlayer(player);
    })
});
