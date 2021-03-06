import { ClientState, PlayerType  } from "../common/clientPlayer";

enum PlayMode
{
  NONE = "NONE",
  WAITINGFORMASTER = "WAITINGFORMASTER",
  WAITINGFORPLAYERS = "WAITINGFORPLAYERS",
  READY = "READY",
  INGAME = "INGAME",
}

class GameState
{
    playmode: PlayMode;
    host: ClientState;
    master: ClientState;
    playerList: Array<ClientState>;

    constructor()
    {
        this.playmode = PlayMode.NONE,
        this.host = null,
        this.master = null,
        this.playerList = []
    }

    setPlayMode(playmode)
    {
        this.playmode = playmode;
        console.log('New Playmode ' + this.playmode);
    }

    addHost(host)
    {
        console.log('Add Host');
        host.playerType = PlayerType.HOST;
        this.host = host;
        this.setPlayMode(PlayMode.WAITINGFORMASTER);
        this.playerList.push(host);
    }

    addMaster(master)
    {
        console.log('Add Master');
        master.playerType = PlayerType.MASTER;
        this.master = master;
        this.setPlayMode(PlayMode.WAITINGFORPLAYERS);
        this.playerList.push(master);
    }

    addPlayer(player)
    {
        console.log('Add Player');
        player.playerType = PlayerType.PLAYER;
        this.playerList.push(player);
    }

    addConnection(client)
    {
        console.log('Add Connection ' + JSON.stringify(client, null, 4));

        if(this.playmode == PlayMode.NONE)
            this.addHost(client);
        else if(this.playmode == PlayMode.WAITINGFORMASTER)
            this.addMaster(client);
        else if(this.playmode == PlayMode.WAITINGFORPLAYERS)
            this.addPlayer(client);
    }

    setOffline(socketID)
    {
        console.log("set offline - " + socketID);

        var iPlayer;
        for (iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) 
        {  
            var clientState = this.playerList[iPlayer];
            if(clientState.socketID === socketID)
                this.playerList[iPlayer].connected = false;
        }
    }

    getHost()
    {
        return this.host;
    }

    getMaster()
    {
        return this.master;
    }

    getClient(socketID)
    {
        var iPlayer;
        for (iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) 
        {  
            console.log("ID To Find - " + socketID);

            var attributes = this.playerList[iPlayer];
            console.log("PLAYER [" + iPlayer + "] \n" + JSON.stringify(attributes));
            if(attributes.socketID === socketID)
                return this.playerList[iPlayer];
        }

        return null;
    }

    getClientByIP(ipaddress)
    {
        var iPlayer;
        for (iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) 
        {  
            console.log("IPAddress To Find - " + ipaddress);

            var attributes = this.playerList[iPlayer];
            console.log("PLAYER [" + iPlayer + "] \n" + JSON.stringify(attributes));
            if(attributes.ipaddress === ipaddress)
            {
                return this.playerList[iPlayer];
            }
        }

        return null;
    }
}

class Game
{
    gameServer: GameServer;
    gameState: GameState;
    playerCount: Number;

    constructor(gameServer) {
        this.gameServer = gameServer;
        this.gameState = new GameState();
        console.log('GameCreated ' + JSON.stringify(this.gameState, null, 4));

        this.playerCount = 0;
        //this.playerRefreshTimer = setTimeout(this.refreshPlayerList, 4000);
    }

    connect(socketID, clientIp, storedID, storedPlayer)
    {
        var client = null;

        if(storedID !== null)
            client = this.getClient(storedID);

        if(client === null || client.connection == true)
            client = this.getClientByIP(clientIp);

        // Attempt to reconnect
        if(client !== null)
        {
            // Check this client matches the details we have stored
            if(client.connection === false && (storedPlayer === null || client.playerType === storedPlayer))
            {
                // Update the client state
                client.socketID = socketID;
                client.ipaddress = clientIp;
                client.connection = true;

                this.sendCreateMessage(client);
            }
            else
            {
                client = null;
            }
        }

        if(client === null)
        {
            // Create a new connection
            this.addConnection(socketID, clientIp);
        }

        return client;
    }

    disconnect(socketID)
    {
        this.gameState.setOffline(socketID);
    }

    addConnection(socketID, ipaddress)
    {
        var client = new ClientState(socketID, ipaddress);
        this.gameState.addConnection(client);

        this.sendCreateMessage(client);

        return client;
    }

    getState()
    {
        return this.gameState;
    }

    getHost()
    {
        return this.getState().getHost();
    }

    getMaster()
    {
        return this.getState().getMaster();
    }

    getClient(playerID)
    {
        return this.getState().getClient(playerID);
    }

    getClientByIP(ipaddress)
    {
        return this.getState().getClientByIP(ipaddress);
    }

    sendCreateMessage(clientState)
    {
        var data = { clientState: clientState };
        this.gameServer.sendMessage(clientState, 'create', data);
    }

    refreshPlayerList()
    {
        var host = this.getState().getHost();
        if(this.gameState == null || host == null)
            return;
            
        var playerList = this.gameState.playerList;

        if(playerList == null)
            return;

        var newPlayerCount = playerList.length;

        if(newPlayerCount != this.playerCount)
        {
            var data = { playerList: playerList };
            this.gameServer.sendMessage(host, 'refreshPlayers', data);
        }
    }
}

export class GameServer 
{
    io: any;
    game: Game;

    constructor(io) {
      this.io = io;
      this.game = new Game(this);
    }
  
    connectToGame(socket)
    {
        var storedID = socket.handshake.query['UUID'];
        var storedPlayer = socket.handshake.query['playerType'];

        var client = null;
        var clientIP = socket.request.connection.remoteAddress;

        client = this.game.connect(socket.id, clientIP, storedID, storedPlayer);
    }

    disconnect(socket)
    {
        this.game.disconnect(socket.id);
    }

    sendMessage(clientState, messageType, data)
    {
        console.log("Sending Msg - " + clientState.playerType + " - " + messageType);

        data.messageType = messageType;

        if(clientState != null)
            this.io.to(`${clientState.socketID}`).emit(messageType, data);
    }
}