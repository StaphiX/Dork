export enum PlayerType 
{
  NONE = "NONE",
  PLAYER = "PLAYER",
  MASTER = "MASTER",
  HOST = "HOST"
};

export class ClientState {
    
    socketID: SocketIOClient.Socket;
    ipaddress: string;
    connected: boolean;
    playerType: PlayerType;

    constructor(socketID, ipaddress) {
        this.socketID = socketID;
        this.ipaddress = ipaddress;
        this.connected = true;
        this.playerType = PlayerType.NONE;
      }

      setPlayerType(playerType)
      {
        this.playerType = playerType;
      }
}

