import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { ClientState, PlayerType } from "../../common/clientPlayer";
import { GameClient, GameHost, GameMaster, GamePlayer } from "./GameClient";

type GameClientControllerProps = { socket: SocketIOClient.Socket };
type GameClientControllerState = { socket: SocketIOClient.Socket, clientState: ClientState };

export class GameClientController extends Component<GameClientControllerProps, GameClientControllerState> {

    constructor(props : GameClientControllerProps) {
        super(props);
        this.state = {
            socket: props.socket,
            clientState: null
        } 

        this.onMessageCreate = this.onMessageCreate.bind(this);
        //this.getGameClient = this.getGameClient.bind(this);
      }

      handleSocket(socket: SocketIOClient.Socket)
      {
        socket.on('create', this.onMessageCreate);

        //if(this.state.gameClient != null)
        //{
          //socket.on('host', this.state.gameClient.handleMessage);
          //socket.on('master', this.state.gameClient.handleMessage);
          //socket.on('player', this.state.gameClient.handleMessage);
        //}
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
          console.log("Update State: " + JSON.stringify(clientState));
          this.setState( { clientState });
      }

      getGameClient()
      {
        console.log("The Current State is: " + JSON.stringify(this.state.clientState));

        if(this.state.clientState == null)
            return null;

        var clientState = this.state.clientState;
        var playerType = this.state.clientState.playerType;

        switch(playerType)
        {
            case PlayerType.HOST:
                return <GameHost clientState = {clientState}/>;
            case PlayerType.MASTER:
                return <GameMaster clientState = {clientState}/>;
            case PlayerType.PLAYER:
                return <GamePlayer clientState = {clientState}/>;
            default:
                return null;
        }  
      }

      render()
      {
          let socket = this.state.socket;
          if(socket != null)
            this.handleSocket(socket);

          let gameClient = this.getGameClient();;

          var playerType = this.state.toString();

          if(gameClient != null)
            console.log("The Current Object is: " + gameClient.toString());

          return (

            gameClient

          )
      }
}
