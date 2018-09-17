import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import StatusBar from "./Components/StatusBar";
import { PlayerType, GameClient, GameHost, GameMaster, GamePlayer } from "../common/clientPlayer";
import Cookies from 'universal-cookie';

type AppState = { gameClient: GameClient };

class App extends Component<any, AppState> {
  
  socket: SocketIOClient.Socket;
  endpoint: string = "http://localhost:4001";

  constructor(props) {
    super(props);
    this.state = {
      gameClient: null
    };

    const cookies = new Cookies();
    var storedID = cookies.get('UUID');

    if(storedID !== undefined && storedID !== null)
    {
      var queryString = "UUID="+storedID;
      this.socket = socketIOClient(this.endpoint, { query: queryString });
    }
    else
    {
      this.socket = socketIOClient(this.endpoint);
    }

    this.handleMessages = this.handleMessages.bind(this);
    this.createClient = this.createClient.bind(this);
  }

  // sending sockets
/*   send = () => {
    const socket = this.socket;
    socket.emit('change color', this.state.color) // change 'red' to this.state.color
  }

  // adding the function
  setColor = (color) => {
    this.setState({ color })
  } */
  
  handleMessages(socket)
  {
    socket.on('create', this.createClient);

    if(this.state.gameClient != null)
    {
      socket.on('host', this.state.gameClient.handleMessage);
      socket.on('master', this.state.gameClient.handleMessage);
      socket.on('player', this.state.gameClient.handleMessage);
    }
  }

  createClient(data)
  {
    console.log("state before create - " + this);

    var clientState = data.clientState;
    var playerType = PlayerType.NONE;

    if(clientState == null)
      return;

    if(clientState.playerType != null)
      playerType = clientState.playerType;

    console.log("createClient - " + clientState);
    
    if(this.state.gameClient != null)
    {
      this.state.gameClient.updateState(clientState);
      this.setState({ gameClient: this.state.gameClient });
    }
    else
    {
      console.log("playerType - " + playerType);

      switch(playerType)
      {
        case PlayerType.HOST:
          this.setState({ gameClient: new GameHost(clientState) });
          break;
        case PlayerType.MASTER:
          this.setState({ gameClient: new GameMaster(clientState) });
          break;
        case PlayerType.PLAYER:
          this.setState({ gameClient: new GamePlayer(clientState) });
          break;
      }  
    }

    console.log("gameClient Created - " + JSON.stringify(this.state));

    const cookies = new Cookies();
    cookies.set('UUID', clientState.socketID);
  }

  render() {
    // testing for socket connections

    const socket = this.socket;
    this.handleMessages(socket);

    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    })

    var playerType = PlayerType.NONE;
    if(this.state.gameClient !== null && this.state.gameClient.clientState != null)
      playerType = this.state.gameClient.clientState.playerType;

    return (
      <div>

      <StatusBar playerType={playerType} />

      </div>
    )
  }
}
export default App;