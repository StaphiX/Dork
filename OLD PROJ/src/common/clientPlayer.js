export const PlayerType = 
{
  NONE: "NONE",
  PLAYER: "PLAYER",
  MASTER: "MASTER",
  HOST: "HOST"
};

export class ClientState {
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

export class GameClient {
    constructor(clientState) {
        this.clientState = clientState;
      }

      handleMessage(data)
      {
          console.log("Message recieved - " + JSON.stringify(data)); 
          var messageType = data.messageType;
          switch(messageType)
          {
              case "create":
                this.messageCreate(data);
                break;
            default:
                break;
          }
      }

      messageCreate(data)
      {
          this.clientState = data.clientState;
      }

      updateState(clientState)
      {
          this.clientState = clientState;
      }
}

export class GamePlayer extends GameClient
{
    constructor(clientState) {
      super(clientState);
    }
}

export class GameMaster extends GameClient
{
    constructor(clientState) {
        super(clientState);
    }
}

export class GameHost extends GameClient
{
    constructor(clientState) {
        super(clientState);
        this.playerList = null;
    }

    handleMessage(data)
    {
        console.log("Host Message recieved - " + JSON.stringify(data)); 
        var messageType = data.messageType;
        switch(messageType)
        {
            case "refreshPlayers":
              this.refreshPlayers(data);
              break;
          default:
              super.handleMessage(data);
              break;
        }
    }

    refreshPlayers(data)
    {
        console.log("New Player List - " + JSON.stringify(data)); 
        if(data != null && data.playerList != null)
            this.playerList = data.playerList;
    }
}