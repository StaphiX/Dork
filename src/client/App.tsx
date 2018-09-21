import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Cookies from 'universal-cookie';

import { PlayerType, ClientState } from "../common/clientPlayer";
import { GameClient, GameHost, GameMaster, GamePlayer } from "./components/GameClient";
import { StatusBar } from "./components/StatusBar";
import { Table } from "./components/Table";
import { GameClientController } from "./components/GameClientController";

type AppState = { };

class App extends Component<any, AppState> {
  
  socket: SocketIOClient.Socket;
  endpoint: string = "http://localhost:4001";

  constructor(props) {
    super(props);
    this.state = {
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
  
  render() {
    // testing for socket connections
    const socket = this.socket;

    socket.on('change color', (col) => {
      document.body.style.backgroundColor = col
    })

    return (
      <div>
        <GameClientController socket={this.socket} />
      </div>
    )
  }
}
export default App;