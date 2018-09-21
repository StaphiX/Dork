import React, { Component } from "react";
import { ClientState, PlayerType } from "../../common/clientPlayer";

type GameClientProps = { clientState: ClientState };
type GameClientState = { clientState: ClientState };

export class GameClient extends Component<GameClientProps, GameClientState> {

    constructor(props : GameClientProps) {
        super(props);
        this.state = {
            clientState: props.clientState
        } 
      }

      getClientState()
      {
          if(this.state.clientState != null)
            return this.state.clientState;

            return null;      
      }

      handleMessage(data)
      {
          console.log("Message recieved - " + JSON.stringify(data)); 
          var messageType = data.messageType;
          switch(messageType)
          {
              case "create":
                this.onMessageCreate(data);
                break;
            default:
                break;
          }
      }

      onMessageCreate(data)
      {
          if(data != null && data.clientState != null)
            this.updateState(data.clientState);
      }

      updateState(clientState)
      {
          this.setState(clientState);
      }

      render()
      {
          var playerType = JSON.stringify(this.state);
          return (
          <p>{ playerType }</p>
          )
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
    playerList: Array<ClientState>;

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